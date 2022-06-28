import { VotoController } from './voto.controller';
import { VotoService } from './voto.service';

import { PrismaService } from '../services/prisma/prisma.service';
import { Voto } from './entities/voto.entity';
import { CreateVotoDto } from './dto/create-voto.dto';
import { S3Service } from '../services/s3/s3.service';

describe('VotoController', () => {
  let assController: VotoController;
  let assService: VotoService;

  beforeEach(() => {
    assService = new VotoService(new PrismaService(new S3Service()));
    assController = new VotoController(assService);
  });

  const voto = new Voto();
  const result = [voto];
  voto.id = '123';
  voto.quantidadeVotos = 100;
  voto.participanteId = null;
  voto.escolhaId = null;

  describe('findAll', () => {
    it('retorna um vetor de Votos', async () => {
      // @ts-ignore
      jest.spyOn(assService, 'findAll').mockImplementation(async () => result);
      expect(await assController.findAll()).toBe(result);
      expect(assService.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de uma voto', async () => {
      const votoModificada = { ...voto, quantidadeVotos: 800 } as Voto;

      jest
        .spyOn(assService, 'update')
        // @ts-ignore
        .mockImplementation(async () => votoModificada);
      expect(
        await assController.update(voto.id, votoModificada as CreateVotoDto),
      ).toBe(votoModificada);

      expect(assService.update).toBeCalledWith(voto.id, votoModificada);
    });
  });

  describe('remove', () => {
    it('remover uma votoTeste', async () => {
      // @ts-ignore
      jest.spyOn(assService, 'remove').mockImplementation(async () => voto);
      expect(await assController.remove(voto.id)).toBe(voto);
      expect(assService.remove).toBeCalledWith(voto.id);
    });
  });
});
