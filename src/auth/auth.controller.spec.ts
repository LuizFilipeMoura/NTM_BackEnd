import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { VotoService } from '../voto/voto.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { S3Service } from '../services/s3/s3.service';
import { VotoController } from '../voto/voto.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    controller = new AuthController(
      new AuthService(new PrismaService(new S3Service()), new JwtService()),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
