import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { closeDatabase, clearDatabase } from './db';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Setup test database connection
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Disconnect if already connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});