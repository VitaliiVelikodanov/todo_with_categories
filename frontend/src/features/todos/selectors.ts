import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Todo } from '../../types/Todo';

export const MAX_TASKS_PER_CATEGORY = 5;

const selectTodosState = (state: RootState) => state.todos;
const selectFilterState = (state: RootState) => state.filter;

export const selectVisibleTodos = createSelector(
  [selectTodosState, selectFilterState],
  (todos, filter) => {
    const normalizedQuery = filter.query.trim().toLowerCase();

    return todos.filter((todo) => {
      const matchesCategory = filter.category
        ? todo.category === filter.category
        : true;

      const matchesQuery = normalizedQuery
        ? todo.title.toLowerCase().includes(normalizedQuery)
        : true;

      const matchesStatus = (() => {
        switch (filter.status) {
          case 'active':
            return !todo.completed;
          case 'completed':
            return todo.completed;
          default:
            return true;
        }
      })();

      return matchesCategory && matchesQuery && matchesStatus;
    });
  },
);

export type CategoryGroup = {
  category: string;
  todos: Todo[];
  totalInCategory: number;
};

export const selectGroupedTodos = createSelector(
  [selectVisibleTodos, selectTodosState],
  (visibleTodos, allTodos) => {
    const totalsByCategory = allTodos.reduce<Record<string, number>>(
      (acc, todo) => {
        acc[todo.category] = (acc[todo.category] ?? 0) + 1;
        return acc;
      },
      {},
    );

    const groups = visibleTodos.reduce<Record<string, Todo[]>>((acc, todo) => {
      if (!acc[todo.category]) {
        acc[todo.category] = [];
      }

      acc[todo.category].push(todo);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
      .map(([category, todos]) => ({
        category,
        todos,
        totalInCategory: totalsByCategory[category] ?? todos.length,
      }));
  },
);
