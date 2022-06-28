import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    service = new S3Service();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // it('deveria fazer upload para o s3', async () => {
  //   await service.uploadJSON({ banana: 'verde' }, '123123');
  // });
  // it('deveria apagar os logs de um documento', async () => {
  //   const r = await service.removeLogs('629e17af6fe54d45c4dec868');
  //   console.log(r);
  // });
});
