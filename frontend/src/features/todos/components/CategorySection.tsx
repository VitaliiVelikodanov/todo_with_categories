import React, { useCallback, useMemo } from 'react';
import { MAX_TASKS_PER_CATEGORY } from '../selectors';
import { CategoryGroup } from '../selectors';
import { TodoRow } from './TodoRow';
import { Todo } from '../../../types/Todo';

type Props = {
  group: CategoryGroup;
  selectedTodoIds: number[];
  pendingRemovalSet: Set<number>;
  onToggleStatus: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleSelectTodo: (id: number, checked: boolean) => void;
  onToggleSelectAll: (todoIds: number[], checked: boolean) => void;
};

const CategorySectionComponent: React.FC<Props> = ({
  group,
  selectedTodoIds,
  pendingRemovalSet,
  onToggleStatus,
  onDelete,
  onToggleSelectTodo,
  onToggleSelectAll,
}) => {
  const selectedIdsSet = useMemo(
    () => new Set(selectedTodoIds),
    [selectedTodoIds],
  );
  const visibleTodoIds = useMemo(
    () => group.todos.map((todo) => todo.id),
    [group.todos],
  );
  const hasVisibleTodos = visibleTodoIds.length > 0;

  const selectedVisibleCount = useMemo(() => {
    return visibleTodoIds.filter((id) => selectedIdsSet.has(id)).length;
  }, [selectedIdsSet, visibleTodoIds]);

  const areAllVisibleSelected =
    visibleTodoIds.length > 0 && selectedVisibleCount === visibleTodoIds.length;

  const handleToggleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onToggleSelectAll(visibleTodoIds, event.target.checked);
    },
    [onToggleSelectAll, visibleTodoIds],
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
            {group.category}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {group.todos.length} tasks
            {selectedVisibleCount > 0
              ? ` · ${selectedVisibleCount} selected`
              : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            className={`${hasVisibleTodos ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
            aria-label={`${areAllVisibleSelected ? 'Clear selection for' : 'Select all tasks in'} ${group.category}`}
          >
            <input
              type="checkbox"
              checked={areAllVisibleSelected}
              onChange={handleToggleSelectAll}
              disabled={!hasVisibleTodos}
              className="peer sr-only"
            />

            <span
              className={`inline-flex h-9 items-center rounded-full border px-3 text-sm font-medium transition peer-focus:ring-2 peer-focus:ring-sky-200 ${
                areAllVisibleSelected
                  ? 'border-sky-200 bg-sky-50 text-sky-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {areAllVisibleSelected ? 'Clear selection' : 'Select all'}
            </span>
          </label>

          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
            {group.totalInCategory}/{MAX_TASKS_PER_CATEGORY}
          </span>
        </div>
      </div>

      <ul className="space-y-2">
        {group.todos.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            isSelected={selectedIdsSet.has(todo.id)}
            isPendingRemoval={pendingRemovalSet.has(todo.id)}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
            onToggleSelect={onToggleSelectTodo}
          />
        ))}
      </ul>
    </section>
  );
};

export const CategorySection = React.memo(CategorySectionComponent);
