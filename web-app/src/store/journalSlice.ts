import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MnlzRecord } from '../models/MnlzRecord';

interface JournalState {
    records: MnlzRecord[];
    filteredRecords: MnlzRecord[];
    selectedId: number | null;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
}

const initialState: JournalState = {
    records: [],
    filteredRecords: [],
    selectedId: null,
    searchQuery: '',
    isLoading: false,
    error: null,
};

const journalSlice = createSlice({
    name: 'journal',
    initialState,
    reducers: {
        setRecords(state, action: PayloadAction<MnlzRecord[]>) {
            state.records = action.payload;
            state.filteredRecords = applyFilter(action.payload, state.searchQuery);
        },
        addRecord(state, action: PayloadAction<MnlzRecord>) {
            state.records.push(action.payload);
            state.records.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
            state.filteredRecords = applyFilter(state.records, state.searchQuery);
        },
        updateRecord(state, action: PayloadAction<MnlzRecord>) {
            const index = state.records.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.records[index] = action.payload;
                state.records.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
                state.filteredRecords = applyFilter(state.records, state.searchQuery);
            }
        },
        deleteRecord(state, action: PayloadAction<number>) {
            state.records = state.records.filter(r => r.id !== action.payload);
            state.filteredRecords = applyFilter(state.records, state.searchQuery);
            if (state.selectedId === action.payload) {
                state.selectedId = null;
            }
        },
        setSelectedId(state, action: PayloadAction<number | null>) {
            state.selectedId = action.payload;
        },
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
            state.filteredRecords = applyFilter(state.records, action.payload);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
    },
});

function applyFilter(records: MnlzRecord[], query: string): MnlzRecord[] {
    const q = query.trim().toLowerCase();
    if (!q) {
        return [...records];
    }
    return records.filter(record => {
        return record.segmentNumber.toLowerCase().includes(q) ||
               record.lastName.toLowerCase().includes(q) ||
               (record.notes && record.notes.toLowerCase().includes(q));
    });
}

export const {
    setRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    setSelectedId,
    setSearchQuery,
    setLoading,
    setError,
} = journalSlice.actions;

export default journalSlice.reducer;
