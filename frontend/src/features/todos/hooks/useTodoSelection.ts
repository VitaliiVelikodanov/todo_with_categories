import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectVisibleTodos } from '../selectors';

export const useTodoSelection = () => {
  const visibleTodos = useAppSelector(selectVisibleTodos);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  useEffect(() => {
    const availableTodoIds = new Set(visibleTodos.map((todo) => todo.id));

    setSelectedTodoIds((current) => {
      const next = current.filter((id) => availableTodoIds.has(id));

      if (next.length === current.length) {
        return current;
      }

      return next;
    });
  }, [visibleTodos]);

  const selectedActiveTodos = useMemo(() => {
    const selectedIdsSet = new Set(selectedTodoIds);

    return visibleTodos.filter(
      (todo) => selectedIdsSet.has(todo.id) && !todo.completed,
    );
  }, [selectedTodoIds, visibleTodos]);

  const handleToggleSelectTodo = useCallback((id: number, checked: boolean) => {
    setSelectedTodoIds((current) => {
      if (checked) {
        if (current.includes(id)) {
          return current;
        }

        return [...current, id];
      }

      return current.filter((currentId) => currentId !== id);
    });
  }, []);

  const handleToggleSelectAll = useCallback(
    (todoIds: number[], checked: boolean) => {
      if (todoIds.length === 0) {
        return;
      }

      setSelectedTodoIds((current) => {
        const currentIdsSet = new Set(current);

        if (checked) {
          todoIds.forEach((id) => currentIdsSet.add(id));

          return Array.from(currentIdsSet);
        }

        const removedIds = new Set(todoIds);

        return current.filter((id) => !removedIds.has(id));
      });
    },
    [],
  );

  const clearSelectionForIds = useCallback((ids: number[]) => {
    const idsSet = new Set(ids);

    setSelectedTodoIds((current) => current.filter((id) => !idsSet.has(id)));
  }, []);

  return {
    selectedTodoIds,
    selectedActiveTodos,
    handleToggleSelectTodo,
    handleToggleSelectAll,
    clearSelectionForIds,
  };
};
