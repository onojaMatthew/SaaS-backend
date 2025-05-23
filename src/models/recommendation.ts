import { model, Schema } from "mongoose";

const RecommendationSchema: Schema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'Reader', 
    required: true 
  },
  contents: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  preferencesSnapshot: {},
  algorithmVersion: { 
    type: String, 
    required: true 
  },
  generatedAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: 0 } // TTL index
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
RecommendationSchema.index({ user: 1 });
RecommendationSchema.index({ generatedAt: -1 });
RecommendationSchema.index({ expiresAt: 1 });

export const Recommendation = model("Recommendation", RecommendationSchema)

