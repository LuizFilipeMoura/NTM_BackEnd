import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { PrismaService } from '../services/prisma/prisma.service';
import { empresaTeste } from './empresa.service.spec';
import { S3Service } from '../services/s3/s3.service';

describe('EmpresaController', () => {
  let controller: EmpresaController;
  let service: EmpresaService;

  beforeEach(() => {
    service = new EmpresaService(new PrismaService(new S3Service()));
    controller = new EmpresaController(service);
  });

  const result = [empresaTeste];
  describe('findAll', () => {
    it('retorna um vetor de empresas', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toBeCalled();
    });
  });

  describe('patch', () => {
    it('atualiza o valor de um empresa', async () => {
      const empresaModificado = { ...empresaTeste, nome: 'Nominho' };

      jest
        .spyOn(service, 'update')
        .mockImplementation(async () => empresaModificado);
      expect(await controller.update(empresaTeste.id, empresaModificado)).toBe(
        empresaModificado,
      );

      expect(service.update).toBeCalledWith(empresaTeste.id, empresaModificado);
    });
  });

  describe('remove', () => {
    it('remover um empresa', async () => {
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => empresaTeste);
      expect(await controller.remove(empresaTeste.id)).toBe(empresaTeste);
      expect(service.remove).toBeCalledWith(empresaTeste.id);
    });
  });
});
