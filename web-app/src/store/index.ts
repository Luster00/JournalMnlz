import { configureStore } from '@reduxjs/toolkit';
import journalReducer from './journalSlice';

export const store = configureStore({
    reducer: {
        journal: journalReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
