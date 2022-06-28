import { Module } from '@nestjs/common';
import { AssembleiaService } from './assembleia.service';
import { AssembleiaController } from './assembleia.controller';

@Module({
  controllers: [AssembleiaController],
  providers: [AssembleiaService],
})
export class AssembleiaModule {}
