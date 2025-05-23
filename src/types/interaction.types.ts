import { Document, Schema } from "mongoose";

export interface IInteraction extends Document {
  userId: Schema.Types.ObjectId;
  contentId: Schema.Types.ObjectId;
  interactionType: 'view' | 'like' | 'share' | 'save' | 'click' | 'comment';
  rating: number;
  createdAt: Date;
}