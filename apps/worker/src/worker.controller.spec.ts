import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios/';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

describe('WorkerController', () => {
  let workerController: WorkerController;
  let schedulerRegistry: SchedulerRegistry;

  beforeEach(async () => {
    console.log(`Before each ... `);

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot(),
        ClientsModule.register([
          {
            name: 'message_client',
            transport: Transport.RMQ,
            options: {
              noAck: false,
              queue: process.env.RMQ_QUEUE_NAME,
              urls: [process.env.RMQ_URL],
            },
          },
        ]),
      ],
      controllers: [WorkerController],
      providers: [WorkerService],
    }).compile();

    workerController = app.get<WorkerController>(WorkerController);
    schedulerRegistry = app.get<SchedulerRegistry>(SchedulerRegistry);
  });

  afterEach(() => {
    console.log(`After all`);
    const cronJobs = schedulerRegistry.getCronJobs();

    cronJobs.forEach((job, key) => {
      schedulerRegistry.deleteCronJob(key);
      console.log(`Deleted cron job: ${key}`);
    });
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(workerController.getHello()).toBe('Hello World!');
    });
  });

  describe('start data fetching', () => {
    it('should start job data fetching on queue"', () => {
      //const startCmd = new StartDataFetchingCommand();
      //startCmd.QueueName = 'test-queue-name';

      console.log('Test Start worker');

      expect(workerController.startWorker(/*startCmd*/)).toBe(
        'data fetching started on queue',
      );

      // expect(workerController.stopWorker(/*startCmd*/)).toBe(
      //   'data fetching stopped on queue',
      // );
    });
  });

  describe('stop data fetching', () => {
    it('should stop job data fetching on queue"', () => {
      //const stopCmd = new StopDataFetchingCommand();
      //stopCmd.QueueName = 'test-queue-name';

      expect(workerController.startWorker(/*startCmd*/)).toBe(
        'data fetching started on queue',
      );

      expect(workerController.stopWorker(/*stopCmd*/)).toBe(
        'data fetching stopped on queue',
      );
    });
  });
});
