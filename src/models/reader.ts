import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Logger } from "../utils/logger";
import { redis } from "../config/redis";
import { IReader } from "../types/reader.types";

// Define user roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  CONTENT_MANAGER = 'content_manager',
  ANALYST = 'analyst',
  USER = 'user'
}

const ReaderSchema = new Schema<IReader>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true },
    lastLogin: { type: Date }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        return ret;
      }
    }
  }
);


ReaderSchema.pre<IReader>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
ReaderSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// import jwt from 'jsonwebtoken';

// In your User model methods:
ReaderSchema.methods.generateAuthToken = function (): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!secret) throw new Error("JWT_SECRET is not defined");
  if (!expiresIn) throw new Error("JWT_EXPIRES_IN is not defined");

  const payload = {
    id: this.id.toString(),
    email: this.email,
    role: this.role
  };

  return jwt.sign(
    payload,
    secret,
    { expiresIn } as jwt.SignOptions
  );
};

// Cache user data after save
ReaderSchema.post<IReader>('save', async function (doc) {
  try {
    await redis.set(
      `reader:${doc._id}`,
      JSON.stringify(doc.toJSON()),
      { EX: 3600 }
    );
  } catch (error) {
    Logger.error(`Failed to cache reader ${doc._id}: ${error}`);
  }
});

export const Reader = model<IReader>('Reader', ReaderSchema);