import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { S3Service } from '../s3/s3.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    service = new PrismaService(new S3Service());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
