import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { deleteTodo, updateTodoStatus } from '../todosApi';
import { actions as todoActions } from '../todosSlice';
import { Todo } from '../../../types/Todo';

const UNDO_DELAY_MS = 5000;

type TransientActionType = 'complete' | 'delete';

type TransientItem = {
  id: number;
  action: TransientActionType;
};

export type UndoCandidate = {
  items: TransientItem[];
  label: string;
};

type UseTransientActionsOptions = {
  onError: (message: string) => void;
  onCategoriesRefresh: () => Promise<void>;
};

export const useTransientActions = ({
  onError,
  onCategoriesRefresh,
}: UseTransientActionsOptions) => {
  const dispatch = useAppDispatch();
  const [undoCandidate, setUndoCandidate] = useState<UndoCandidate | null>(null);
  const [isUndoing, setIsUndoing] = useState(false);
  const [pendingRemovalIds, setPendingRemovalIds] = useState<number[]>([]);
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const clearTimer = useCallback((id: number) => {
    const timer = timersRef.current[id];

    if (timer) {
      clearTimeout(timer);
      delete timersRef.current[id];
    }
  }, []);

  const removePendingId = useCallback((id: number) => {
    setPendingRemovalIds((current) => current.filter((itemId) => itemId !== id));
  }, []);

  const addPendingId = useCallback((id: number) => {
    setPendingRemovalIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      return [...current, id];
    });
  }, []);

  const removeIdsFromUndoCandidate = useCallback((idsToRemove: number[]) => {
    if (idsToRemove.length === 0) {
      return;
    }

    const removeSet = new Set(idsToRemove);

    setUndoCandidate((current) => {
      if (!current) {
        return null;
      }

      const nextItems = current.items.filter((item) => !removeSet.has(item.id));

      if (nextItems.length === 0) {
        return null;
      }

      if (nextItems.length > 1) {
        return {
          items: nextItems,
          label: `${nextItems.length} tasks`,
        };
      }

      return {
        items: nextItems,
        label: current.label,
      };
    });
  }, []);

  const finalizeRemoval = useCallback(
    async (id: number) => {
      try {
        await deleteTodo(id);
        dispatch(todoActions.removeTodo(id));
        await onCategoriesRefresh();
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to delete todo.';
        onError(message);
      } finally {
        clearTimer(id);
        removePendingId(id);
        removeIdsFromUndoCandidate([id]);
      }
    },
    [
      clearTimer,
      dispatch,
      onCategoriesRefresh,
      onError,
      removeIdsFromUndoCandidate,
      removePendingId,
    ],
  );

  const scheduleRemoval = useCallback(
    (items: TransientItem[], label: string) => {
      items.forEach(({ id }) => {
        clearTimer(id);
        addPendingId(id);
        timersRef.current[id] = setTimeout(() => {
          void finalizeRemoval(id);
        }, UNDO_DELAY_MS);
      });

      setUndoCandidate((current) => {
        if (!current) {
          return { items, label };
        }

        const mergedItems = [...current.items];

        items.forEach((item) => {
          if (!mergedItems.some((existing) => existing.id === item.id)) {
            mergedItems.push(item);
          }
        });

        return {
          items: mergedItems,
          label: mergedItems.length === 1 ? label : `${mergedItems.length} tasks`,
        };
      });
    },
    [addPendingId, clearTimer, finalizeRemoval],
  );

  const cancelPendingForIds = useCallback(
    (ids: number[]) => {
      ids.forEach((id) => {
        clearTimer(id);
        removePendingId(id);
      });
    },
    [clearTimer, removePendingId],
  );

  const completeTodo = useCallback(
    async (todo: Todo) => {
      onError('');

      try {
        const updated = await updateTodoStatus(todo.id, { completed: true });
        dispatch(todoActions.updateTodo(updated));
        scheduleRemoval([{ id: updated.id, action: 'complete' }], updated.title);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to update todo.';
        onError(message);
      }
    },
    [dispatch, onError, scheduleRemoval],
  );

  const uncompleteTodo = useCallback(
    async (todo: Todo) => {
      onError('');
      cancelPendingForIds([todo.id]);
      removeIdsFromUndoCandidate([todo.id]);

      try {
        const updated = await updateTodoStatus(todo.id, { completed: false });
        dispatch(todoActions.updateTodo(updated));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Failed to update todo.';
        onError(message);
      }
    },
    [cancelPendingForIds, dispatch, onError, removeIdsFromUndoCandidate],
  );

  const toggleTodoStatus = useCallback(
    async (todo: Todo) => {
      if (todo.completed) {
        await uncompleteTodo(todo);
        return;
      }

      await completeTodo(todo);
    },
    [completeTodo, uncompleteTodo],
  );

  const deleteTodoWithUndo = useCallback(
    async (todo: Todo) => {
      onError('');
      cancelPendingForIds([todo.id]);
      removeIdsFromUndoCandidate([todo.id]);
      scheduleRemoval([{ id: todo.id, action: 'delete' }], todo.title);
    },
    [cancelPendingForIds, onError, removeIdsFromUndoCandidate, scheduleRemoval],
  );

  const bulkCompleteTodos = useCallback(
    async (todos: Todo[]) => {
      if (todos.length === 0) {
        return [];
      }

      onError('');

      try {
        const updatedTodos = await Promise.all(
          todos.map((todo) => updateTodoStatus(todo.id, { completed: true })),
        );

        updatedTodos.forEach((todo) => {
          dispatch(todoActions.updateTodo(todo));
        });

        scheduleRemoval(
          updatedTodos.map((todo) => ({ id: todo.id, action: 'complete' as const })),
          updatedTodos.length === 1
            ? updatedTodos[0].title
            : `${updatedTodos.length} tasks`,
        );

        return updatedTodos.map((todo) => todo.id);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to update selected todos.';
        onError(message);
        return [];
      }
    },
    [dispatch, onError, scheduleRemoval],
  );

  const undoPendingActions = useCallback(async () => {
    if (!undoCandidate) {
      return;
    }

    setIsUndoing(true);
    onError('');

    const items = undoCandidate.items;
    cancelPendingForIds(items.map((item) => item.id));

    try {
      const completeItems = items.filter((item) => item.action === 'complete');

      if (completeItems.length > 0) {
        const results = await Promise.allSettled(
          completeItems.map((item) =>
            updateTodoStatus(item.id, { completed: false }),
          ),
        );

        const hasRejected = results.some(
          (result) => result.status === 'rejected',
        );

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            dispatch(todoActions.updateTodo(result.value));
          }
        });

        if (hasRejected) {
          onError('Some tasks could not be restored.');
        }
      }

      setUndoCandidate(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to restore todo.';
      onError(message);
    } finally {
      setIsUndoing(false);
    }
  }, [cancelPendingForIds, dispatch, onError, undoCandidate]);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      Object.values(timers).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  const pendingRemovalSet = useMemo(
    () => new Set(pendingRemovalIds),
    [pendingRemovalIds],
  );

  return {
    undoCandidate,
    isUndoing,
    pendingRemovalSet,
    toggleTodoStatus,
    deleteTodoWithUndo,
    bulkCompleteTodos,
    undoPendingActions,
    cancelPendingForIds,
  };
};
