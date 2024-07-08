import { configureStore } from '@reduxjs/toolkit';
import treeReducer from './treeReducer.tsx';

export const store = configureStore({
  reducer: {
    tree: treeReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;