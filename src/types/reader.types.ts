import { Document, Schema } from "mongoose";

export interface IReader {
  _id: Schema.Types.ObjectId;
  email: string;
  password: string;
  lastLogin: Date;
  role: string;
  isModified: any;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  toJSON(): any;
}