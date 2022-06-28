import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { S3Service } from './services/s3/s3.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private s3: S3Service) {}

  @Get()
  async getHello() {
    this.s3.removeLogs('62b34623d4f46006adaa7bb1');
  }
}
