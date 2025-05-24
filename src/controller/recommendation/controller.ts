import { NextFunction, Request, Response } from 'express';
import { RecommendationService } from '../../services/recommendation/service';
import { ContentService } from '../../services/content/service';
import { Logger } from '../../utils/logger';
import { AppError } from '../../utils/errorHandler';
import { Interaction } from '../../models/interaction';

const recommendationService = new RecommendationService();
const contentService = new ContentService();

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { limit = 10, userId } = req.query;
    if (typeof userId !== "string") return;
    const recommendations = await recommendationService.getRecommendationsForUser(
      userId,
      Number(limit)
    );

    // Enrich content data
    const enrichedRecs = await Promise.all(
      recommendations.map(async (rec) => {
        const enriched = await contentService.enrichContentData(rec);
        return enriched;
      })
    );

    res.json({
      success: true,
      data: enrichedRecs,
      message: 'Recommendations fetched successfully'
    });
  } catch (error) {
    Logger.error('Error in getRecommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recommendations'
    });
  }
};

export const logInteraction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user._id;
    const { contentId, interactionType } = req.body;

     let interaction = new Interaction({ userId, contentId, interactionType });

    await interaction.save();

    res.json({
      success: true,
      message: 'Interaction logged successfully',
      data: null
    });
  } catch (error) {
    Logger.error('Error in logInteraction:', error);
    next(new AppError("Internal Server Error", 500));
  }
};

