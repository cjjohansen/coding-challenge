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
    @Inject('message-client') private readonly ampqClientProxy: ClientProxy, //@Inject('worker-tcp-client') private readonly tcpClientProxy: ClientProxy,
  ) {}

  startDataFecthing(startDataFecthingCmd: StartDataFetchingCommand) {
    console.log('Hellso: ', startDataFecthingCmd);

    return this.ampqClientProxy.send<string, StartDataFetchingCommand>(
      'startDataFecthing',
      startDataFecthingCmd,
    );
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
