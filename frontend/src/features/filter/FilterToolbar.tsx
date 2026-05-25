import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as filterActions } from './filterSlice';
import { Status } from '../../types/Status';

type Props = {
  categories: string[];
};

const FilterToolbarComponent: React.FC<Props> = ({ categories }) => {
  const { query, status, category } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  return (
    <form
      className="flex flex-col gap-3 md:flex-row"
      onSubmit={(event) => event.preventDefault()}
    >
      <select
        data-cy="statusSelect"
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-800 outline-none transition focus:border-slate-500"
        value={status}
        onChange={(e) =>
          dispatch(filterActions.setStatus(e.target.value as Status))
        }
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <select
        data-cy="categorySelect"
        className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-800 outline-none transition focus:border-slate-500"
        value={category}
        onChange={(e) => dispatch(filterActions.setCategory(e.target.value))}
      >
        <option value="">All categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <div className="relative flex-1">
        <input
          data-cy="searchInput"
          type="text"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-10 pr-10 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
          placeholder="Search..."
          value={query}
          onChange={(e) => dispatch(filterActions.setQuery(e.target.value))}
        />

        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
          🔍
        </span>

        {query !== '' && (
          <button
            data-cy="clearSearchButton"
            type="button"
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 px-3 text-slate-400 transition hover:text-slate-700"
            onClick={() => dispatch(filterActions.setQuery(''))}
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
};

export const FilterToolbar = React.memo(FilterToolbarComponent);
