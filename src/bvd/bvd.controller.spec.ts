import { PrismaService } from '../services/prisma/prisma.service';
import { BvdController } from './bvd.controller';
import { BvdService } from './bvd.service';
import { Bvd } from './entities/bvd.entity';
import { CreateBvdDto } from './dto/create-bvd.dto';
import { ParticipanteService } from '../participante/participante.service';
import { VotoService } from '../voto/voto.service';
import { S3Service } from '../services/s3/s3.service';

describe('bvdController', () => {
  let controller: BvdController;
  let service: BvdService;

  beforeEach(() => {
    const prismaService = new PrismaService(new S3Service());
    service = new BvdService(
      prismaService,
      new ParticipanteService(prismaService),
      new VotoService(prismaService),
    );
    controller = new BvdController(service);
  });

  const bvd = new Bvd();
  const result = [bvd];

  describe('findAll', () => {
    it('retorna um vetor de bvds', async () => {
      // @ts-ignore
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de um bvd', async () => {
      const bvdModificado = { ...bvd, nome: 'Nominho' };

      jest
        .spyOn(service, 'update')
        // @ts-ignore

        .mockImplementation(async () => bvdModificado);
      expect(
        await controller.update(bvd.id, bvdModificado as CreateBvdDto),
      ).toBe(bvdModificado);

      expect(service.update).toBeCalledWith(bvd.id, bvdModificado);
    });
  });

  describe('remove', () => {
    it('remover um bvd', async () => {
      // @ts-ignore
      jest.spyOn(service, 'remove').mockImplementation(async () => bvd);
      expect(await controller.remove(bvd.id)).toBe(bvd);
      expect(service.remove).toBeCalledWith(bvd.id);
    });
  });
});
