import { Controller, Body, Get, Delete, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  StartDataFetchingCommand,
  StopDataFetchingCommand,
} from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/api/v1/data-stream')
  startDataFecthing(@Body() startDataFecthingCmd: StartDataFetchingCommand) {
    return this.appService.startDataFecthing(startDataFecthingCmd);
  }

  @Delete('/api/v1/data-stream')
  stopDataFecthing(
    @Body() stopDataFecthingCmd: StopDataFetchingCommand,
  ): string {
    return this.appService.stopDataFecthing(stopDataFecthingCmd);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
