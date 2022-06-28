import { PautaController } from './pauta.controller';
import { PautaService } from './pauta.service';
import { Pauta } from './entities/pauta.entity';
import { EscolhaService } from '../escolha/escolha.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreatePautaDto } from './dto/create-pauta.dto';
import { TIPO_VOTANTE } from '../shared/enums/pautaEnums';
import { S3Service } from '../services/s3/s3.service';

describe('PautaController', () => {
  let pautaController: PautaController;
  let escolhaService: EscolhaService;
  let pautaService: PautaService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService(new S3Service());
    escolhaService = new EscolhaService(prismaService);
    pautaService = new PautaService(escolhaService, prismaService);
    pautaController = new PautaController(pautaService);
  });

  const pauta = new Pauta();
  const result = [pauta];
  pauta.id = '123';
  pauta.ordem = 2;
  pauta.descricao = 'um';
  pauta.status = 1;
  pauta.tipoAcaoVotante = TIPO_VOTANTE.ON;
  pauta.abstencao = 'Absteve';
  pauta.naoVotou = 'Não Votou';

  describe('findAll', () => {
    it('retorna um vetor de Pautas', async () => {
      jest
        .spyOn(pautaService, 'findAll')
        // @ts-ignore

        .mockImplementation(async () => result);
      expect(await pautaController.findAll()).toBe(result);
      expect(pautaService.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de uma pauta', async () => {
      const pautaModificada = { ...pauta, ordem: 1 };

      jest
        .spyOn(pautaService, 'update')
        // @ts-ignore

        .mockImplementation(async () => pautaModificada);
      expect(
        await pautaController.update(
          pauta.id,
          pautaModificada as CreatePautaDto,
        ),
      ).toBe(pautaModificada);

      expect(pautaService.update).toBeCalledWith(pauta.id, pautaModificada);
    });
  });

  describe('remove', () => {
    it('remover uma pauta', async () => {
      // @ts-ignore

      jest.spyOn(pautaService, 'remove').mockImplementation(async () => pauta);
      expect(await pautaController.remove(pauta.id)).toBe(pauta);
      expect(pautaService.remove).toBeCalledWith(pauta.id);
    });
  });
});
