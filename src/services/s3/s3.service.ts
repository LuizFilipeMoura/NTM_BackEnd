import { S3 } from 'aws-sdk';
import { Logger, Injectable, OnModuleInit } from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import axios from 'axios';
const bucketS3 = 'ntm-logs';

@Injectable()
export class S3Service {
  config = {
    region: 'sa-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };

  async upload(file, dateNow) {
    const { originalname } = file;
    await this.uploadS3(file.buffer, bucketS3, originalname, dateNow);
  }

  async uploadS3(file, bucket, name, dateNow) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${name}/${dateNow}.json`,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
  async uploadJSON(json: any, dateNow: string) {
    const stringFy = JSON.stringify(json);
    const file = {
      originalname: `${json.id}`,
      buffer: Buffer.from(stringFy, 'utf-8'),
    };
    await this.upload(file, dateNow);
  }

  async listObjects(id: string) {
    const s3Client = new S3Client(this.config);
    const command = new ListObjectsCommand({
      Bucket: bucketS3,
      Delimiter: '.json',
      Prefix: id,
    });
    return await s3Client.send(command);
  }
  async getLogsFromS3(id: string) {
    const response = await this.listObjects(id);

    if (!response.CommonPrefixes) return [];
    let promesas: any = response.CommonPrefixes.map((prefix) =>
      axios.get('https://ntm-logs.s3.sa-east-1.amazonaws.com/' + prefix.Prefix),
    );
    promesas = (await Promise.all(promesas)).map(
      (promesa: any) => promesa.data,
    );
    return promesas;
  }

  async removeLogs(id: string) {
    const response = await this.listObjects(id);

    const keyList: any = response.CommonPrefixes.map((prefix) => {
      return {
        Key: prefix.Prefix,
      };
    });
    const command = new DeleteObjectsCommand({
      Bucket: bucketS3,
      Delete: { Objects: keyList },
    });
    await new S3Client(this.config).send(command);
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
