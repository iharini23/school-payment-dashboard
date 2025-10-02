import { MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

async function ensureServer(): Promise<MongoMemoryServer> {
  if (!mongoMemoryServer) {
    mongoMemoryServer = await MongoMemoryServer.create();

    const cleanup = () => {
      if (mongoMemoryServer) {
        const server = mongoMemoryServer;
        mongoMemoryServer = null;
        void server.stop();
      }
    };

    process.once('exit', cleanup);
    process.once('SIGINT', cleanup);
    process.once('SIGTERM', cleanup);
  }

  return mongoMemoryServer;
}

export async function createInMemoryMongoOptions(): Promise<MongooseModuleOptions> {
  const server = await ensureServer();

  return {
    uri: server.getUri(),
    serverSelectionTimeoutMS: 5000,
  };
}

export async function stopInMemoryMongo(): Promise<void> {
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
}
