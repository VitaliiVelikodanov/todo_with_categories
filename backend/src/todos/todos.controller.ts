import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller()
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get('todos')
  findAll(@Query('category') category?: string) {
    return this.todosService.findAll(category);
  }

  @Post('todos')
  create(@Body() createTodoDto: CreateTodoDto) {
    if (!createTodoDto.title.trim()) {
      throw new BadRequestException('Title is required.');
    }

    if (!createTodoDto.category.trim()) {
      throw new BadRequestException('Category is required.');
    }

    return this.todosService.create(
      createTodoDto.title,
      createTodoDto.category,
    );
  }

  @Patch('todos/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    if (id <= 0) {
      throw new BadRequestException('Invalid todo id.');
    }

    return this.todosService
      .updateCompletion(id, updateTodoDto.completed)
      .then((updated) => {
        if (!updated) {
          throw new NotFoundException('Todo not found.');
        }

        return updated;
      });
  }

  @Delete('todos/:id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    if (id <= 0) {
      throw new BadRequestException('Invalid todo id.');
    }

    const deleted = await this.todosService.remove(id);

    if (!deleted) {
      throw new NotFoundException('Todo not found.');
    }
  }
}
