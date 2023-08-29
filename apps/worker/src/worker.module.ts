import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios/';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
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
})
export class WorkerModule {}
