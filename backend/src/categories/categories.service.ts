import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<string[]> {
    const categories = await this.prisma.todo.findMany({
      distinct: ['category'],
      select: { category: true },
    });

    return categories
      .map((row) => row.category)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }
}
