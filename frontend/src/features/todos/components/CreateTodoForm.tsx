import React, { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type CreateTodoFormValues = {
  title: string;
  category: string;
  newCategory: string;
};

type Props = {
  categories: string[];
  isSaving: boolean;
  onCreate: (payload: { title: string; category: string }) => Promise<void>;
};

const CreateTodoFormComponent = ({ categories, isSaving, onCreate }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateTodoFormValues>({
    defaultValues: {
      title: '',
      category: 'General',
      newCategory: '',
    },
  });

  const selectedCreateCategory = watch('category');
  const isAddingNewCategory = selectedCreateCategory === '__new__';
  const categoryOptions = useMemo(() => {
    return [...new Set(['General', ...categories])];
  }, [categories]);

  const handleCreateTodo: SubmitHandler<CreateTodoFormValues> = async ({
    title,
    category,
    newCategory,
  }) => {
    const resolvedCategory =
      category === '__new__' ? newCategory.trim() : category.trim();

    try {
      await onCreate({
        title: title.trim(),
        category: resolvedCategory,
      });

      reset({
        title: '',
        category: resolvedCategory,
        newCategory: '',
      });
    } catch {
      // Parent handles and displays submission errors.
    }
  };

  return (
    <>
      <form
        className="mb-5 grid gap-3 md:grid-cols-[2fr_1fr_auto]"
        onSubmit={handleSubmit(handleCreateTodo)}
      >
        <input
          className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
          placeholder="Add todo title"
          {...register('title', {
            required: 'Task text is required.',
            validate: (value) =>
              value.trim().length > 0 || 'Task text is required.',
          })}
        />

        <div className="grid gap-2">
          <select
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
            {...register('category', {
              required: 'Category is required.',
            })}
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            <option value="__new__">+ Add new category</option>
          </select>

          {isAddingNewCategory && (
            <input
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
              placeholder="New category name"
              {...register('newCategory', {
                validate: (value) => {
                  if (!isAddingNewCategory) {
                    return true;
                  }

                  return value.trim().length > 0 || 'New category is required.';
                },
              })}
            />
          )}
        </div>

        <button
          type="submit"
          className="h-11 rounded-lg bg-slate-900 px-5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Create'}
        </button>
      </form>

      {(errors.title || errors.category || errors.newCategory) && (
        <p className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800">
          {errors.title?.message ??
            errors.category?.message ??
            errors.newCategory?.message}
        </p>
      )}
    </>
  );
};

export const CreateTodoForm = React.memo(CreateTodoFormComponent);
