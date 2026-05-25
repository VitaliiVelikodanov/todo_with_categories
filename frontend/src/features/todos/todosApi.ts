import { Todo } from '../../types/Todo';
import { apiClient, getErrorMessage } from '../../shared/api/client';

type CreateTodoPayload = {
  title: string;
  category: string;
};

type UpdateTodoStatusPayload = {
  completed: boolean;
};

export const getTodos = async (category?: string) => {
  try {
    const response = await apiClient.get<Todo[]>('/todos', {
      params: category ? { category } : undefined,
    });

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createTodo = async (payload: CreateTodoPayload) => {
  try {
    const response = await apiClient.post<Todo>('/todos', payload);

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTodoStatus = (
  id: number,
  payload: UpdateTodoStatusPayload,
) => {
  return apiClient
    .patch<Todo>(`/todos/${id}`, payload)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(getErrorMessage(error));
    });
};

export const deleteTodo = async (id: number) => {
  try {
    await apiClient.delete(`/todos/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get<string[]>('/categories');

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
