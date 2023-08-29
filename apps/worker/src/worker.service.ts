import { Logger, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as dayjs from 'dayjs';

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

    const currentSecond = dayjs().second();
    let scheduleConfig = `${currentSecond + 2} ${
      process.env.JOB_INTERVAL_IN_MINUTES
    } * * * *`;

    scheduleConfig = `* * * * * *`;

    console.log(scheduleConfig);

    const job = new CronJob(scheduleConfig, () => this.fetchData());

    if (this.schedulerRegistry.getCronJobs().size > 0) {
      throw new RpcException({
        type: 400,
        msg: 'weather data job already added',
      });
    }
    this.schedulerRegistry.addCronJob(process.env.WORKER_JOB_NAME, job);
    job.start();

    console.log('job started on: ', process.env.WORKER_JOB_NAME);

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

    const mainUrl = process.env.WEATHER_API_HISTORY_URL;
    const apiKey = process.env.WEATHER_API_KEY;
    let url = '';
    const date = '2023-08-01';
    const location = 'Copenhagen';

    url = `${mainUrl}?key=${apiKey}&q=${location}&dt=${date}`;

    const observableData = await this.httpService.get(url);

    observableData.subscribe((weatherData) => {
      console.log('Received weather data: ' + JSON.stringify(weatherData.data));
      this.clientProxy.emit('weather-data', JSON.stringify(weatherData.data));
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
