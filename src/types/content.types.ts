import { Document, Schema } from "mongoose";

export interface IContent extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  textContent: string;
  type: 'text' | 'image' | 'link' | 'video';
  category: string
  ratings?: number[];
  averageRating: number
  businessId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}