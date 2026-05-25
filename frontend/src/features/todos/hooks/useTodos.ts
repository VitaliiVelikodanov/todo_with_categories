import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { createTodo, getTodos } from '../todosApi';
import { actions as todoActions } from '../todosSlice';

type UseTodosOptions = {
  onError: (message: string) => void;
  onCategoriesRefresh: () => Promise<void>;
};

export const useTodos = ({ onError, onCategoriesRefresh }: UseTodosOptions) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    onError('');

    try {
      const todosFromServer = await getTodos();
      dispatch(todoActions.setTodos(todosFromServer));
      await onCategoriesRefresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to load todos.';
      onError(message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, onCategoriesRefresh, onError]);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const handleCreateTodo = useCallback(
    async (payload: { title: string; category: string }) => {
      setIsSaving(true);
      onError('');

      try {
        const created = await createTodo(payload);
        dispatch(todoActions.addTodo(created));
        await onCategoriesRefresh();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to create todo.';
        onError(message);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [dispatch, onCategoriesRefresh, onError],
  );

  return {
    isLoading,
    isSaving,
    handleCreateTodo,
    reloadTodos: loadTodos,
  };
};
