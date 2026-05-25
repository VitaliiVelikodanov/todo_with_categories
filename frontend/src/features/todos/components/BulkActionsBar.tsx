import React, { useCallback } from 'react';

type Props = {
  selectedCount: number;
  activeSelectedCount: number;
  isUpdating: boolean;
  onMarkSelectedDone: () => void;
};

const BulkActionsBarComponent: React.FC<Props> = ({
  selectedCount,
  activeSelectedCount,
  isUpdating,
  onMarkSelectedDone,
}) => {
  const handleMarkSelectedDone = useCallback(() => {
    onMarkSelectedDone();
  }, [onMarkSelectedDone]);

  return (
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-700">
        {selectedCount} selected, {activeSelectedCount} not done
      </p>

      <button
        type="button"
        className="h-10 rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleMarkSelectedDone}
        disabled={activeSelectedCount === 0 || isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Mark selected as done'}
      </button>
    </div>
  );
};

export const BulkActionsBar = React.memo(BulkActionsBarComponent);
