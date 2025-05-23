import { model, Schema } from "mongoose";
import { IContent } from "../types/content.types";

const ContentSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  author: { type: String, trim: true },
  textContent: { type: String, required: true },
  ratings: [{ type: Number }],
  averageRating: { type: Number },
  type: {
    type: String,
    enum: ['text', 'image', 'link', 'video']
  },
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
ContentSchema.index({ slug: 1 });
ContentSchema.index({ contentType: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ publishedAt: -1 });

// Update the updatedAt field before saving
ContentSchema.pre<IContent>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Content = model<IContent>('Content', ContentSchema);