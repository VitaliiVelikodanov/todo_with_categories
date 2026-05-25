import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, TodosModule, CategoriesModule],
})
export class AppModule {}
