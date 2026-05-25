import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex w-full justify-center py-5" data-cy="loader">
    <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-300 border-t-slate-700" />
  </div>
);
