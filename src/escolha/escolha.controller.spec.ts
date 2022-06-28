import { EscolhaController } from './escolha.controller';
import { EscolhaService } from './escolha.service';
import { Escolha } from './entities/escolha.entity';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateEscolhaDto } from './dto/create-escolha.dto';
import { S3Service } from '../services/s3/s3.service';

describe('EscolhaController', () => {
  let assController: EscolhaController;
  let assService: EscolhaService;

  beforeEach(() => {
    assService = new EscolhaService(new PrismaService(new S3Service()));
    assController = new EscolhaController(assService);
  });

  const escolha = new Escolha();
  escolha.ordem = 1;
  escolha.opcao = 'Aprovar';

  const result = [escolha];
  describe('findAll', () => {
    it('retorna um vetor de Escolhas', async () => {
      // @ts-ignore
      jest.spyOn(assService, 'findAll').mockImplementation(async () => result);
      expect(await assController.findAll()).toBe(result);
      expect(assService.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de uma escolha', async () => {
      const escolhaModificada = { ...escolha, opcao: 'B', pautaId: '123123' };

      jest
        .spyOn(assService, 'update')
        .mockImplementation(async () => escolhaModificada);
      expect(
        await assController.update(
          escolha.id,
          escolhaModificada as CreateEscolhaDto,
        ),
      ).toBe(escolhaModificada);

      expect(assService.update).toBeCalledWith(escolha.id, {
        ...escolhaModificada,
      });
    });
  });

  describe('remove', () => {
    it('remover uma escolhaTeste', async () => {
      jest.spyOn(assService, 'remove').mockImplementation(async () => escolha);
      expect(await assController.remove(escolha.id)).toBe(escolha);
      expect(assService.remove).toBeCalledWith(escolha.id);
    });
  });
});
