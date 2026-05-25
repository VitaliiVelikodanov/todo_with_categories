import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCategories } from '../todos/todosApi';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);

  const refreshCategories = useCallback(async () => {
    const categoriesFromServer = await getCategories();
    setCategories(categoriesFromServer);
  }, []);

  useEffect(() => {
    void refreshCategories();
  }, [refreshCategories]);

  const categoryOptions = useMemo(() => {
    return [...new Set(['General', ...categories])];
  }, [categories]);

  return {
    categories,
    categoryOptions,
    refreshCategories,
  };
};
