import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

class StartDataFetchingCommand {
  public QueueName: string;
}

class StopDataFetchingCommand {
  public QueueName: string;
}

@Injectable()
class AppService {
  constructor(
    @Inject('message-client') private readonly clientProxy: ClientProxy,
  ) {}

  startDataFecthing(startDataFecthingCmd: StartDataFetchingCommand): string {
    console.log(startDataFecthingCmd);

    return `data fetching started on queue: ${startDataFecthingCmd.QueueName}`;
  }

  stopDataFecthing(stopDataFecthingCmd: StopDataFetchingCommand): string {
    console.log(stopDataFecthingCmd);

    return `data fetching stopped on queue: ${stopDataFecthingCmd.QueueName}`;
  }

  getHello(): string {
    return 'Hello World!';
  }
}

export { StartDataFetchingCommand, StopDataFetchingCommand, AppService };
