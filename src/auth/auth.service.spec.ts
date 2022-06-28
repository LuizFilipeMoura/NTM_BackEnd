import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { S3Service } from '../services/s3/s3.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    service = new AuthService(
      new PrismaService(new S3Service()),
      new JwtService(),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
