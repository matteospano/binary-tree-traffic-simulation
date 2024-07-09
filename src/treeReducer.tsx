import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Layer {
    from: number[];
    to: number[];
}
export const DEF_LAYERS: Layer[] =
    [{//L0
        from: [0, 0, 1, 2],
        to: [0, 1, 1, 2]
    }, {//L1
        from: [0, 1, 1, 2],
        to: [3, 3, 4, 4]
    }, {//L2
        from: [3, 3, 4],
        to: [5, 6, 7]
    }]

interface TreeState {
    currLevel: number;
    balls: number;
    population: number[];
    layers: Layer[];
}

const initialState: TreeState = {
    currLevel: 1,
    balls: 5,
    layers: DEF_LAYERS,
    population: [
        0, 0, 50,
        0, 10,
        0, 1, 20,
        0, 1, 30]
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
        setNodePop: (state, action: PayloadAction<number[]>) => ({
            ...state,
            population: action.payload,
            balls: state.balls + 1
        }),
    }
});

export const { setCurrLevel, setNodePop }
    = treeSlice.actions;

export default treeSlice.reducer;
