import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { connect } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('AppController', () => {
  let appController: AppController;
  let mongod: MongoMemoryServer;
  let uri: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();

    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should be ping', () => {
      const res = appController.ping();
      expect(res).toBe('pong');
    });

    it('should be connected mongo', async () => {
      const conn = await connect(process.env.MONGO_URL || uri, {
        dbName: process.env.MONGO_DB,
      });
      const readyState = conn.connection.readyState;
      expect(readyState).toBe(conn.ConnectionStates.connected);
    });
  });
});
