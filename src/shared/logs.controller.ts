import { Controller, Get, Param } from '@nestjs/common';
import { S3Service } from '../services/s3/s3.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.s3Service.getLogsFromS3(id);
  }
}
