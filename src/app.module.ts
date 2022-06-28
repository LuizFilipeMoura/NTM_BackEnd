import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssembleiaModule } from './assembleia/assembleia.module';
import { ParticipanteModule } from './participante/participante.module';
import { PautaModule } from './pauta/pauta.module';
import { VotoModule } from './voto/voto.module';
import { EscolhaModule } from './escolha/escolha.module';
import { EmpresaModule } from './empresa/empresa.module';
import { BvdModule } from './bvd/bvd.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { S3Service } from './services/s3/s3.service';
import { S3Module } from './services/s3/s3.module';
import { LogsController } from './shared/logs.controller';

@Module({
  imports: [
    AssembleiaModule,
    ParticipanteModule,
    PautaModule,
    VotoModule,
    EscolhaModule,
    EmpresaModule,
    BvdModule,
    PrismaModule,
    S3Module,
    FuncionarioModule,
    AuthModule,
  ],
  controllers: [AppController, LogsController],
  providers: [AppService],
})
export class AppModule {}
