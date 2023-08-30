import {
  Logger,
  BadRequestException,
  Controller,
  //Post,
  //Delete,
} from '@nestjs/common';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { WorkerService } from './worker.service';
import { StartDataFetchingCommand } from './commands';

@Controller()
export class WorkerController {
  private readonly logger = new Logger(WorkerService.name);

  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern('startDataFetching')
  startWorker(cmd: StartDataFetchingCommand, @Ctx() context: RmqContext) {
    console.log('WorkerController startWorkers');
    console.log(context.getMessage());

    this.logger.debug(
      'WorkerController startWorker on queue: ' + cmd.QueueName,
    );

    try {
      this.workerService.startWorker();
    } catch (e) {
      console.log('WorkerController startWorkers exception: ' + e.message);
      this.logger.debug('WorkerController startWorkers exception:' + e.message);

      if (e.type == 400) {
        throw new BadRequestException('Worker already created');
      }
    }

    return `data fetching started on queue: ${cmd.QueueName}`;
  }

  @MessagePattern('stopDataFetching')
  stopWorker() {
    try {
      this.workerService.stopWorker();
    } catch (e) {
      if (e.type == 400) {
        throw new BadRequestException('No workers present');
      }
    }

    return 'data fetching stopped on queue';
  }

  getHello(): string {
    return this.workerService.getHello();
  }
}
