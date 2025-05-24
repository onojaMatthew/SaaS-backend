import * as tf from '@tensorflow/tfjs';
import { Content } from '../../models/content';
import { Interaction } from '../../models/interaction';
import { redis } from '../../config/redis';
import { Logger } from '../../utils/logger';
import { IContent } from '../../types/content.types';
import { ContentBasedFiltering } from '../ai/contentBased';

export class RecommendationService {
  private cbModel: ContentBasedFiltering;
  private static RECOMMENDATION_CACHE_TTL = 1800; // 30 minutes

  constructor() {
    this.cbModel = new ContentBasedFiltering();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize content-based model first (doesn't need interactions)
      await this.cbModel.train();
      Logger.info('Recommendation models initialized');
    } catch (error) {
      Logger.error('Error initializing recommendation models:', error);
      throw error;
    }
  }

  public async getRecommendationsForUser(
    userId: string,
    limit: number = 10
  ): Promise<IContent[]> {
    const cacheKey = `recommendations:user:${userId}:${limit}`;
    
    try {
      // Try cache first
      const cachedRecs = await redis.get(cacheKey);
      if (cachedRecs) {
        Logger.debug(`Recommendation cache hit for user ${userId}`);
        return JSON.parse(cachedRecs);
      }

      Logger.debug(`Recommendation cache miss for user ${userId}`);
      
      // Get recommendations - handle case when CF model isn't available
      const recommendations = await this.generateRecommendations(userId, limit);
      
      // Cache the recommendations
      await redis.set(
        cacheKey,
        JSON.stringify(recommendations),
        { EX: RecommendationService.RECOMMENDATION_CACHE_TTL }
      );

      return recommendations;
    } catch (error) {
      Logger.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(limit);
    }
  }

  private async generateRecommendations(
    userId: string,
    limit: number
  ): Promise<IContent[]> {
    try {
      // Always get CB recommendations
      const cbRecs = await this.cbModel.recommendForUser(userId, limit * 2);
      
      // Combine results (adjust weights based on which models are available)
      const combinedIds = this.combineRecommendations(
        cbRecs, 
        limit,
        0.3
      );
      
      // Fetch full content details
      return await Content.find({
        _id: { $in: combinedIds }
      }).lean() as IContent[];
    } catch (error) {
      Logger.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations(limit);
    }
  }

  

  private combineRecommendations(
    // cfRecs: string[],
    cbRecs: string[],
    limit: number,
    cfWeight: number = 0.7,
    cbWeight: number = 0.3
  ): string[] {
    const combined = new Map<string, number>();
    // Content-based results
    cbRecs.forEach((id, index) => {
      const score = (cbRecs.length - index) * cbWeight;
      combined.set(id, (combined.get(id) || 0) + score);
    });

    // Sort by combined score and return top N
    return Array.from(combined.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  private async getFallbackRecommendations(limit: number): Promise<IContent[]> {
    try {
      // Fallback to popular content when recommendations fail
      const popularContent = await Interaction.aggregate([
        { $group: { _id: '$contentId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $lookup: {
            from: 'contents',
            localField: '_id',
            foreignField: '_id',
            as: 'content'
        }},
        { $unwind: '$content' },
        { $replaceRoot: { newRoot: '$content' } }
      ]);

      return popularContent as IContent[];
    } catch (error) {
      Logger.error('Error getting fallback recommendations:', error);
      return [];
    }
  }

  public async logInteraction(
    userId: string,
    contentId: string,
    interactionType: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Create interaction record
      await Interaction.create({
        userId,
        contentId,
        interactionType,
        metadata,
      });

      // Invalidate recommendation cache
      await redis.del(`recommendations:user:${userId}:*`);

      // Update models in background
      setImmediate(async () => {
        try {
          this.cbModel.updateContentVectors(contentId)
          Logger.debug(`Updated models for user ${userId} and content ${contentId}`);
        } catch (error) {
          Logger.error('Background model update error:', error);
        }
      });
    } catch (error: any) {
      Logger.error('Error logging interaction:', error);
      throw new Error(error.message);
    }
  }

  public async refreshRecommendationModels(): Promise<void> {
    try {
      Logger.info('Refreshing recommendation models...');

      // Dispose old models first
      try {
        this.cbModel.dispose();
      } catch (disposeError) {
        Logger.warn('Error disposing old models:', disposeError);
      }
      
      // Create new instances
      this.cbModel = new ContentBasedFiltering();

      await this.cbModel.train()
      // Clear all recommendation caches
      const keys = await redis.keys('recommendations:user:*');
      if (keys.length > 0) {
        for (let key of keys) {
          await redis.del(key);
        }
      }
      Logger.info('Recommendation models refreshed successfully');
    } catch (error) {
      Logger.error('Error refreshing recommendation models:', error);
      throw error;
    }
  }
}



