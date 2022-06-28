import { ParticipanteController } from './participante.controller';
import { ParticipanteService } from './participante.service';
import { Participante } from './entities/participante.entity';
import { PrismaService } from '../services/prisma/prisma.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { S3Service } from '../services/s3/s3.service';

describe('ParticipantesController', () => {
  let controller: ParticipanteController;
  let service: ParticipanteService;

  beforeEach(async () => {
    service = new ParticipanteService(new PrismaService(new S3Service()));
    controller = new ParticipanteController(service);
  });
  const participante = new Participante();
  const result = [participante];
  participante.nome = 'Participante TESTE';
  participante.email = 'emailteste@teste.com';
  participante.status = 1;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('retorna um vetor de Participantes', async () => {
      // @ts-ignore

      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de um participante', async () => {
      const participanteModificado = { ...participante, nome: 'Nome Alterado' };

      jest
        .spyOn(service, 'update') // @ts-ignore

        .mockImplementation(async () => participanteModificado);
      expect(
        await controller.update(
          participante.id,
          participanteModificado as CreateParticipanteDto,
        ),
      ).toBe(participanteModificado);

      expect(service.update).toBeCalledWith(
        participante.id,
        participanteModificado,
      );
    });
  });

  describe('remove', () => {
    it('remover um participante', async () => {
      jest
        .spyOn(service, 'remove')
        // @ts-ignore

        .mockImplementation(async () => participante);
      expect(await controller.remove(participante.id)).toBe(participante);
      expect(service.remove).toBeCalledWith(participante.id);
    });
  });
});
