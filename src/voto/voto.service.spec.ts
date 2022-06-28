import { Test, TestingModule } from '@nestjs/testing';
import { VotoService } from './voto.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { Voto } from './entities/voto.entity';
import { CreateVotoDto } from './dto/create-voto.dto';
import { S3Service } from '../services/s3/s3.service';

export const votoTeste = new CreateVotoDto();
votoTeste.quantidadeVotos = 100;
votoTeste['pautaId'] = null;
describe('VotoService', () => {
  let service: VotoService;
  let prismaService: PrismaService;

  let id = '';

  beforeAll(async () => {
    process.env.DATABASE_URL =
      'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority';
  });

  beforeEach(async () => {
    prismaService = new PrismaService(new S3Service());

    service = new VotoService(prismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Salvar uma voto', async () => {
    const respostaCriacao = await service.create(votoTeste);
    id = respostaCriacao.id;
    await expect(respostaCriacao).toEqual(
      expect.objectContaining({
        ...votoTeste,
      }),
    );
    console.log(id);
  });

  it('Ler a voto', async () => {
    console.log(id);
    await expect(service.findOne(id)).resolves.toEqual({
      ...votoTeste,
      escolhaId: null,
      participanteId: null,
      id,
    });
  });

  it('Alterar a voto', async () => {
    console.log(id);
    await expect(
      service.update(id, {
        ...votoTeste,
        quantidadeVotos: 784,
      }),
    ).resolves.toEqual({
      ...votoTeste,
      id,
      quantidadeVotos: 784,
      escolhaId: null,
      participanteId: null,
    });
  });

  it('Deletar voto criada', async () => {
    console.log(id);
    await expect(service.remove(id)).resolves.toBeDefined();
  });
});
