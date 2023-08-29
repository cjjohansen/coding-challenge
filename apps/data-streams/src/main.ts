import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

const initMicroservice = async (app: INestApplication) => {
  app.connectMicroservice({
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
  });
  await app.startAllMicroservices();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await initMicroservice(app);
  await app.listen(3000);
}
bootstrap();
