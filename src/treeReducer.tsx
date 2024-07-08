import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Layer {
    from: string[];
    to: string[];
}
// export const EMPTY_FIELD: Field = {
//     P1side: [],
//     P2side: []
// }


interface TreeState {
    currLevel: number;
    layers: Layer[];
}

const initialState: TreeState = {
    currLevel: 0,
    layers: []
};

const treeSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        setCurrLevel: (state, action: PayloadAction<number>) => ({
            ...state,
            currLevel: action.payload,
            layers: []
        }),
    }
});

export const { setCurrLevel } = treeSlice.actions;

export default treeSlice.reducer;
