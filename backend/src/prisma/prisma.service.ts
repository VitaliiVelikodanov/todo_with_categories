import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const DEFAULT_DATABASE_URL = process.env.VERCEL
  ? 'file:/tmp/data.sqlite'
  : 'file:./data.sqlite';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    process.env.DATABASE_URL ??= DEFAULT_DATABASE_URL;
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
