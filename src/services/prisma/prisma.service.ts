import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private s3: S3Service) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      const result = await next(params);
      console.log(params);
      if (['create', 'createMany', 'update'].includes(params.action)) {
        Object.keys(result).map((chave) => {
          if (!result[chave]) {
            delete result[chave];
          }
        });
        result._timestamp = Date.now().toString();
        result._operation = params.action;

        await this.s3.uploadJSON(result, Date.now().toString());
        // Logic only runs for delete action and Post model
      }
      return result;
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
