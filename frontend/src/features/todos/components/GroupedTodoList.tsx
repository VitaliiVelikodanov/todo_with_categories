import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectGroupedTodos } from '../selectors';
import { CategorySection } from './CategorySection';
import { Todo } from '../../../types/Todo';

type Props = {
  selectedTodoIds: number[];
  pendingRemovalSet: Set<number>;
  onToggleStatus: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleSelectTodo: (id: number, checked: boolean) => void;
  onToggleSelectAll: (todoIds: number[], checked: boolean) => void;
};

const GroupedTodoListComponent: React.FC<Props> = ({
  selectedTodoIds,
  pendingRemovalSet,
  onToggleStatus,
  onDelete,
  onToggleSelectTodo,
  onToggleSelectAll,
}) => {
  const groupedTodos = useAppSelector(selectGroupedTodos);

  if (groupedTodos.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center">
        <p className="mb-1 text-2xl">🗂️</p>
        <p className="font-medium text-slate-800">No tasks</p>
        <p className="text-sm text-slate-500">
          Create a task or change filters to see more.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedTodos.map((group) => (
        <CategorySection
          key={group.category}
          group={group}
          selectedTodoIds={selectedTodoIds}
          pendingRemovalSet={pendingRemovalSet}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onToggleSelectTodo={onToggleSelectTodo}
          onToggleSelectAll={onToggleSelectAll}
        />
      ))}
    </div>
  );
};

export const GroupedTodoList = React.memo(GroupedTodoListComponent);
