import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TodosService', () => {
  let service: TodosService;

  const prismaMock = {
    todo: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get(TodosService);
    jest.clearAllMocks();
  });

  it('rejects creating a 6th task in the same category', async () => {
    prismaMock.todo.count.mockResolvedValue(5);

    await expect(service.create('Task 6', 'Work')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('creates a todo when category is below the limit', async () => {
    prismaMock.todo.count.mockResolvedValue(4);
    prismaMock.todo.create.mockResolvedValue({
      id: 1,
      title: 'Task 5',
      category: 'Work',
      completed: false,
    });

    await expect(service.create('Task 5', 'Work')).resolves.toEqual({
      id: 1,
      title: 'Task 5',
      category: 'Work',
      completed: false,
    });
  });
});
