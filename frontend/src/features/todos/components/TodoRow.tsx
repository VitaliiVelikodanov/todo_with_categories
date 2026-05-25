import React, { useCallback } from 'react';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  isSelected: boolean;
  isPendingRemoval: boolean;
  onToggleStatus: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onToggleSelect: (id: number, checked: boolean) => void;
};

const TodoRowComponent: React.FC<Props> = ({
  todo,
  isSelected,
  isPendingRemoval,
  onToggleStatus,
  onDelete,
  onToggleSelect,
}) => {
  const handleToggleStatus = useCallback(() => {
    onToggleStatus(todo);
  }, [onToggleStatus, todo]);

  const handleDelete = useCallback(() => {
    onDelete(todo);
  }, [onDelete, todo]);

  const handleToggleSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onToggleSelect(todo.id, event.target.checked);
    },
    [onToggleSelect, todo.id],
  );

  return (
    <li
      data-cy="todo"
      className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition ${
        isPendingRemoval
          ? 'border-amber-300 bg-amber-50 opacity-70'
          : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <label
        className="shrink-0 cursor-pointer"
        aria-label={`${isSelected ? 'Unselect' : 'Select'} ${todo.title} for bulk actions`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelect}
          className="peer sr-only"
        />

        <span
          className={`inline-flex h-8 items-center rounded-full border px-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition peer-focus:ring-2 peer-focus:ring-sky-200 ${
            isSelected
              ? 'border-sky-200 bg-sky-50 text-sky-700'
              : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
          }`}
        >
          {isSelected ? 'Picked' : 'Pick'}
        </span>
      </label>

      <label
        className="flex shrink-0 cursor-pointer items-center"
        aria-label={`Mark ${todo.title} as completed`}
      >
        <input
          data-cy="toggleButton"
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleStatus}
          className="peer sr-only"
        />

        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition peer-focus:ring-2 peer-focus:ring-emerald-200 ${
            todo.completed
              ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
              : 'border-slate-300 bg-white text-slate-300 hover:border-emerald-400 hover:text-emerald-500'
          }`}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            todo.completed ? 'text-slate-400 line-through' : 'text-slate-800'
          }`}
        >
          {todo.title}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
          todo.completed
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {todo.completed ? 'Done' : 'Not done'}
      </span>

      <button
        data-cy="deleteButton"
        type="button"
        onClick={handleDelete}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
        aria-label={`Delete ${todo.title}`}
      >
        🗑
      </button>
    </li>
  );
};

export const TodoRow = React.memo(TodoRowComponent);
