import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { redis } from '../../config/redis';
import { User, UserRole } from "../../models/user";
import { Business } from "../../models/business";
import { key } from "../../config/key";
import { Logger } from "../../utils/logger";
import { Reader } from "../../models/reader";

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
    businessName: string,
    role: UserRole = UserRole.USER
  ) {
    
    // Create business first
    const business = await Business.create({
      name: businessName,
      slug: businessName.toLowerCase().replace(/\s+/g, '-'),
    });

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      businessName,
      businessId: business._id,
      slug: business.slug,
      subscription: {
        plan: 'free',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
      }
    });

    // Update business owner
    business.owner = user._id;
    await business.save();

    // Generate token
    const token = user.generateAuthToken();
    return { user, token, business };
  }

  static async registerReader(
    email: string,
    password: string,
    role: UserRole = UserRole.USER
  ) {
   
    // Create reader account
    const reader = await Reader.create({
      email,
      password,
      role,
    });
   
    // Generate token
    const token = reader.generateAuthToken();
    return { user: reader, token };
  }

  static async login(email: string, password: string) {
    const secret = key.SECRET;
    const expiresIn = key.EXPIRES_IN;

    if (!secret) throw new Error("JWT_SECRET is not defined");
    if (!expiresIn) throw new Error("JWT_EXPIRES_IN is not defined");
    
    // Not in cache, check database
    const user = await User.findOne({ email }).select('-password');
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Cache user data
    await redis.set(
      `user:email:${email}`,
      JSON.stringify(user.toJSON()),
      { EX: 3600 }
    );

    const token = user.generateAuthToken();
    return { user, token };
  }

  static async signin(email: string, password: string) {
    const secret = key.SECRET;
    const expiresIn = key.EXPIRES_IN;

    if (!secret) throw new Error("JWT_SECRET is not defined");
    if (!expiresIn) throw new Error("JWT_EXPIRES_IN is not defined");
   
    // Not in cache, check database
    const user = await Reader.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Cache user data
    await redis.set(
      `reader:email:${email}`,
      JSON.stringify(user.toJSON()),
      { EX: 3600 }
    );

    const token = user.generateAuthToken();
    return { user, token };
  }

  static async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        businessId: string;
        role: UserRole;
      };

      // Check cache first
      const cachedUser = await redis.get(`user:${decoded.id}`);
      if (cachedUser) {
        return { user: JSON.parse(cachedUser), decoded };
      }

      // Not in cache, fetch from database
      const user = await User.findById(decoded.id);
      if (!user) throw new Error('User not found');

      // Cache user data
      await redis.set(
        `user:${user._id}`,
        JSON.stringify(user.toJSON()),
        { EX: 3600 } // 1 hour
      );

      return { user, decoded };
    } catch (error: any) {
      Logger.error(error.message);
      throw new Error('Invalid or expired token');
    }
  }
}
