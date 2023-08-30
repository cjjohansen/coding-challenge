import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'message-client',
        transport: Transport.RMQ,
        options: {
          noAck: true,
          queue: process.env.RMQ_QUEUE_NAME,
          urls: [process.env.RMQ_URL],
        },
      },
      {
        name: 'worker-tcp-client',
        transport: Transport.TCP,
        options: {
          host: process.env.WORKER_HOST_URL,
          port: Number(process.env.WORKER_HOST_PORT),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
