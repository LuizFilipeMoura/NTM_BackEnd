import { AssembleiaController } from './assembleia.controller';
import { AssembleiaService } from './assembleia.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateAssembleiaDto } from './dto/create-assembleia.dto';
import { S3Service } from '../services/s3/s3.service';

describe('AssembleiaController', () => {
  let assController: AssembleiaController;
  let assService: AssembleiaService;

  beforeEach(() => {
    assService = new AssembleiaService(new PrismaService(new S3Service()));
    assController = new AssembleiaController(assService);
  });

  const assembleia = new CreateAssembleiaDto();
  const result = [assembleia];
  assembleia.id = '123';
  assembleia.nome = 'Assembleia Ordinaria';

  describe('findAll', () => {
    it('retorna um vetor de Assembleias', async () => {
      // @ts-ignore
      jest.spyOn(assService, 'findAll').mockImplementation(async () => result);
      expect(await assController.findAll()).toBe(result);
      expect(assService.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de uma assembleiaTeste', async () => {
      const assembleiaModificada = { ...assembleia, nome: 'Nome Alterado' };

      jest
        .spyOn(assService, 'update')
        // @ts-ignore
        .mockImplementation(async () => assembleiaModificada);
      expect(
        await assController.update(assembleia.id, assembleiaModificada),
      ).toBe(assembleiaModificada);

      expect(assService.update).toBeCalledWith(
        assembleia.id,
        assembleiaModificada,
      );
    });
  });

  describe('remove', () => {
    it('remover uma assembleiaTeste', async () => {
      jest
        .spyOn(assService, 'remove')
        // @ts-ignore
        .mockImplementation(async () => assembleia);
      expect(await assController.remove(assembleia.id)).toBe(assembleia);
      expect(assService.remove).toBeCalledWith(assembleia.id);
    });
  });
});
