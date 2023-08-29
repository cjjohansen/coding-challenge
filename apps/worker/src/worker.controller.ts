import {
  Logger,
  BadRequestException,
  Controller,
  Post,
  Delete,
} from '@nestjs/common';
import { WorkerService } from './worker.service';

@Controller()
export class WorkerController {
  private readonly logger = new Logger(WorkerService.name);

  constructor(private readonly workerService: WorkerService) {}

  @Post('workers')
  startWorker() {
    console.log('WorkerController startWorkers');
    this.logger.debug('WorkerController startWorkers');

    try {
      this.workerService.startWorker();
    } catch (e) {
      console.log('WorkerController startWorkers exception: ' + e.message);
      this.logger.debug('WorkerController startWorkers exception:' + e.message);

      if (e.type == 400) {
        throw new BadRequestException('Worker already created');
      }
    }

    return 'data fetching started on queue';
  }

  @Delete('workers')
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
