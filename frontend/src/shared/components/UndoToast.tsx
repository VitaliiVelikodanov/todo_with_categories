type Props = {
  label: string;
  count: number;
  isUndoing: boolean;
  onUndo: () => void;
};

export const UndoToast = ({ label, count, isUndoing, onUndo }: Props) => {
  return (
    <div className="fixed bottom-4 left-1/2 z-20 w-[min(92vw,560px)] -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate">
          {count === 1
            ? `"${label}" will be removed in 5 seconds.`
            : `${label} will be removed in 5 seconds.`}
        </p>

        <button
          type="button"
          onClick={onUndo}
          disabled={isUndoing}
          className="shrink-0 rounded-md border border-emerald-300 px-3 py-1 font-medium text-emerald-200 transition hover:bg-emerald-900/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUndoing ? 'Undoing...' : 'Undo'}
        </button>
      </div>
    </div>
  );
};
