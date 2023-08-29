import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
//import { ClientProxy } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
})
export class AppModule {}
