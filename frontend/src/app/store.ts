import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { todosSlice } from '../features/todos/todosSlice';
import { filterSlice } from '../features/filter/filterSlice';

const rootReducer = combineSlices({
  todos: todosSlice.reducer,
  filter: filterSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
