import { Module } from '@nestjs/common';
import { EscolhaService } from './escolha.service';
import { EscolhaController } from './escolha.controller';

@Module({
  controllers: [EscolhaController],
  providers: [EscolhaService],
})
export class EscolhaModule {}
