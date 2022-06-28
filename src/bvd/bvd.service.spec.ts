import { Test, TestingModule } from '@nestjs/testing';
import { BvdService } from './bvd.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { ParticipanteService } from '../participante/participante.service';
import { VotoService } from '../voto/voto.service';
import { S3Service } from '../services/s3/s3.service';

describe('BvdService', () => {
  let service: BvdService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [BvdService],
    // }).compile();
    //
    // service = module.get<BvdService>(BvdService);
    const prismaService = new PrismaService(new S3Service());
    service = new BvdService(
      prismaService,
      new ParticipanteService(prismaService),
      new VotoService(prismaService),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
