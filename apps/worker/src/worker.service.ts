import {
  // BadRequestException,
  Logger,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
    @Inject('message_client') private readonly clientProxy: ClientProxy,
  ) {}

  startWorker() {
    console.log(`${process.env.Job_INTERVAL_IN_MINUTES}`);

    const job = new CronJob(
      `*/${process.env.JOB_INTERVAL_IN_MINUTES} * * * * *`,
      () => this.fetchData(),
    );

    if (this.schedulerRegistry.getCronJobs().size > 0) {
      throw new RpcException({
        type: 400,
        msg: 'music data job already added',
      });
    }
    this.schedulerRegistry.addCronJob(process.env.WORKER_JOB_NAME, job);
    job.start();

    this.logger.log('job started on: ', process.env.WORKER_JOB_NAME);
  }

  stopWorker() {
    console.log(`${process.env.Job_INTERVAL_IN_MINUTES}`);

    if (this.schedulerRegistry.getCronJobs().size == 0) {
      throw new RpcException({ type: 400, msg: 'No worker present' });
    }
    this.schedulerRegistry.deleteCronJob(process.env.WORKER_JOB_NAME);

    this.logger.log('job stopped.');
  }

  async fetchData() {
    this.logger.log('Fetching data');

    // //const url = 'https://api.artic.edu/api/v1/artworks/129884';
    // const url = `https://${process.env.SPOTIFY_API_URL}`;
    // const data = await this.httpService.get(url).toPromise();
    // const musicData = data.data.data;
    // const musicDataShaped = musicData;
    // // _.pick(musicData, [
    // //   'id',
    // //   'title',
    // //   'artist_title',
    // //   'place_of_origin',
    // //   'timestamp',
    // // ]);
    // this.clientProxy.emit('music-data', JSON.stringify(musicDataShaped));
  }

  getHello(): string {
    return 'Hello World!';
  }
}
