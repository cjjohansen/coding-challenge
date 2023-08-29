import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      // Setup communication protocol here
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RMQ_URL],
        queue: process.env.RMQ_QUEUE,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  app.listen();
}
bootstrap();
