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

export interface linkLine {
    source: number, target: number,
    prob: number, sel: number
}

interface TreeState {
    currLevel: number;
    balls: number;
    population: number[];
    layers: Layer[];
    animation: { layer: number, state: boolean, links: linkLine[] }
}

const initialState: TreeState = {
    currLevel: 1,
    balls: 8,
    layers: DEF_LAYERS,
    population: [
        0, 20, 50,
        0, 10,
        0, 1, 2,
        0, 0, 0
    ],
    animation: {
        layer: 99,
        state: false,
        links: [
            { source: 0.0, target: 1.0, prob: 1, sel: 0 },
            { source: 0.0, target: 1.1, prob: 1, sel: 0 },
            { source: 0.1, target: 1.1, prob: 1, sel: 0 },
            { source: 0.2, target: 1.1, prob: 1, sel: 0 },

            { source: 1.0, target: 2.0, prob: 1.0, sel: 0 },
            { source: 1.0, target: 2.1, prob: 0.5, sel: 0 },
            { source: 1.1, target: 2.1, prob: 0.5, sel: 0 },
            { source: 1.1, target: 2.2, prob: 1.0, sel: 0 },

            { source: 2.0, target: 3.0, prob: 0.5, sel: 0 },
            { source: 2.0, target: 3.1, prob: 0.5, sel: 0 },
            { source: 2.1, target: 3.0, prob: 0.5, sel: 0 },
            { source: 2.1, target: 3.1, prob: 0.5, sel: 0 },
            { source: 2.1, target: 3.2, prob: 0.5, sel: 0 },
            { source: 2.2, target: 3.2, prob: 0.5, sel: 0 }
        ]
    }
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
            population: action.payload
        }),
        setAnimation: (state, action: PayloadAction<{ layer: number, state: boolean, links?: linkLine[] }>) => ({
            ...state,
            animation: {
                ...state.animation,
                layer: action.payload.layer,
                state: action.payload.state,
                links: action.payload.state && action.payload.links ?
                    action.payload.links : state.animation.links.map((l) => { return { ...l, sel: 0 } })
            },
            balls: action.payload.layer === 99 ? state.balls + 1 : state.balls
        }),
    }
});

export const { setCurrLevel, setNodePop,
    setAnimation
}
    = treeSlice.actions;

export default treeSlice.reducer;
