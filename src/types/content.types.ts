import { Document, Schema } from "mongoose";

export interface IContent extends Document {
  title: string;
  description: string;
  textContent: string;
  type: 'text' | 'image' | 'link' | 'video';
  rating?: number;
  businessId: Schema.Types.ObjectId;
  createdAt: Date;
  tags: [];
  duration: number;
  metadata: Record<string, any>;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}