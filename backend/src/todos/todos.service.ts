import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

export type TodoResponse = {
  id: number;
  title: string;
  category: string;
  completed: boolean;
};

const MAX_TASKS_PER_CATEGORY = 5;

function mapTodo(todo: {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    category: todo.category,
    completed: todo.completed,
  };
}

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string): Promise<TodoResponse[]> {
    const todos = await this.prisma.todo.findMany({
      where: category ? { category } : undefined,
      orderBy: { id: 'desc' },
    });

    return todos.map(mapTodo);
  }

  async create(title: string, category: string): Promise<TodoResponse> {
    const normalizedCategory = category.trim();
    const normalizedTitle = title.trim();

    const categoryCount = await this.prisma.todo.count({
      where: { category: normalizedCategory },
    });

    if (categoryCount >= MAX_TASKS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category "${normalizedCategory}" already has 5 tasks.`,
      );
    }

    const created = await this.prisma.todo.create({
      data: {
        title: normalizedTitle,
        category: normalizedCategory,
        completed: false,
      },
    });

    return mapTodo(created);
  }

  async updateCompletion(
    id: number,
    completed: boolean,
  ): Promise<TodoResponse | null> {
    const existing = await this.prisma.todo.findUnique({ where: { id } });

    if (!existing) {
      return null;
    }

    const updated = await this.prisma.todo.update({
      where: { id },
      data: { completed },
    });

    return mapTodo(updated);
  }

  async remove(id: number): Promise<boolean> {
    const existing = await this.prisma.todo.findUnique({ where: { id } });

    if (!existing) {
      return false;
    }

    await this.prisma.todo.delete({ where: { id } });
    return true;
  }
}
