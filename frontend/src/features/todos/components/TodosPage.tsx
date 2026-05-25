import { useCallback, useState } from 'react';
import { useCategories } from '../../categories/useCategories';
import { FilterToolbar } from '../../filter/FilterToolbar';
import { ErrorBanner } from '../../../shared/components/ErrorBanner';
import { Loader } from '../../../shared/components/Loader';
import { UndoToast } from '../../../shared/components/UndoToast';
import { useTodoSelection } from '../hooks/useTodoSelection';
import { useTodos } from '../hooks/useTodos';
import { useTransientActions } from '../hooks/useTransientActions';
import { BulkActionsBar } from './BulkActionsBar';
import { CreateTodoForm } from './CreateTodoForm';
import { GroupedTodoList } from './GroupedTodoList';

export const TodosPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const { categories, categoryOptions, refreshCategories } = useCategories();

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const { isLoading, isSaving, handleCreateTodo } = useTodos({
    onError: handleError,
    onCategoriesRefresh: refreshCategories,
  });

  const {
    undoCandidate,
    isUndoing,
    pendingRemovalSet,
    toggleTodoStatus,
    deleteTodoWithUndo,
    bulkCompleteTodos,
    undoPendingActions,
  } = useTransientActions({
    onError: handleError,
    onCategoriesRefresh: refreshCategories,
  });

  const {
    selectedTodoIds,
    selectedActiveTodos,
    handleToggleSelectTodo,
    handleToggleSelectAll,
    clearSelectionForIds,
  } = useTodoSelection();

  const handleMarkSelectedDone = useCallback(async () => {
    if (selectedActiveTodos.length === 0) {
      return;
    }

    setIsBulkUpdating(true);

    try {
      const updatedIds = await bulkCompleteTodos(selectedActiveTodos);

      if (updatedIds.length > 0) {
        clearSelectionForIds(updatedIds);
      }
    } finally {
      setIsBulkUpdating(false);
    }
  }, [bulkCompleteTodos, clearSelectionForIds, selectedActiveTodos]);

  return (
    <>
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl md:p-8">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-slate-900">
            Todos
          </h1>

          <CreateTodoForm
            categories={categoryOptions}
            isSaving={isSaving}
            onCreate={handleCreateTodo}
          />

          <div className="mb-5">
            <FilterToolbar categories={categories} />
          </div>

          <BulkActionsBar
            selectedCount={selectedTodoIds.length}
            activeSelectedCount={selectedActiveTodos.length}
            isUpdating={isBulkUpdating}
            onMarkSelectedDone={handleMarkSelectedDone}
          />

          <div className="mb-5">
            <ErrorBanner message={errorMessage} />
          </div>

          <div>
            {isLoading && <Loader />}
            {!isLoading && (
              <GroupedTodoList
                selectedTodoIds={selectedTodoIds}
                pendingRemovalSet={pendingRemovalSet}
                onToggleStatus={toggleTodoStatus}
                onDelete={deleteTodoWithUndo}
                onToggleSelectTodo={handleToggleSelectTodo}
                onToggleSelectAll={handleToggleSelectAll}
              />
            )}
          </div>
        </div>
      </div>

      {undoCandidate && (
        <UndoToast
          label={undoCandidate.label}
          count={undoCandidate.items.length}
          isUndoing={isUndoing}
          onUndo={undoPendingActions}
        />
      )}
    </>
  );
};
