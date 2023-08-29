import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import {
  AppService,
  StartDataFetchingCommand,
  StopDataFetchingCommand,
} from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ClientsModule.register([
          {
            name: 'message-client',
            transport: Transport.RMQ,
            options: {
              noAck: false,
              queue: process.env.WORKER_QUEUE,
              urls: [process.env.RMQ_URL],
            },
          },
        ]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('start data fetching', () => {
    it('should start job data fetching on queue"', () => {
      const startCmd = new StartDataFetchingCommand();
      startCmd.QueueName = 'test-queue-name';

      expect(appController.startDataFecthing(startCmd)).toBe(
        'data fetching started on queue: test-queue-name',
      );
    });
  });

  describe('stop data fetching', () => {
    it('should stop job data fetching on queue"', () => {
      const stopCmd = new StopDataFetchingCommand();
      stopCmd.QueueName = 'test-queue-name';

      expect(appController.stopDataFecthing(stopCmd)).toBe(
        'data fetching stopped on queue: test-queue-name',
      );
    });
  });
});
