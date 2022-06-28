import { PrismaClient } from '@prisma/client';

const prismaMock = new PrismaClient({
  datasources: {
    db: {
      url: 'mongodb+srv://tenmeetings:4QTSPDIUm2qrh5wE@tenmeetings.ytkqd.mongodb.net/TenMeetingsTEST?retryWrites=true&w=majority',
    },
  },
});
export default prismaMock;
