import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Layer {
    from: number[];
    to: number[];
}

export interface linkLine {
    source: number, target: number,
    prob: number, bonus: number,
    sel: number, color: string
}

export const DEF_LINK: linkLine =
{
    source: 0.0,
    target: 0.0,
    prob: 1,
    sel: 0,
    color: '#d3d3d3',
    bonus: 0 //new weighted probability
}

export const DEF_LINKS: linkLine[] = [
    { ...DEF_LINK, source: 0.0, target: 1.0 },
    { ...DEF_LINK, source: 0.0, target: 1.1 },
    { ...DEF_LINK, source: 0.1, target: 1.1 },
    { ...DEF_LINK, source: 0.2, target: 1.1 },

    { ...DEF_LINK, source: 1.0, target: 2.0 },
    { ...DEF_LINK, source: 1.0, target: 2.1, prob: 0.5 },
    { ...DEF_LINK, source: 1.1, target: 2.1, prob: 0.5 },
    { ...DEF_LINK, source: 1.1, target: 2.2 },

    { ...DEF_LINK, source: 2.0, target: 3.0, prob: 0.5 },
    { ...DEF_LINK, source: 2.0, target: 3.1, prob: 0.33 },
    { ...DEF_LINK, source: 2.1, target: 3.0, prob: 0.5 },
    { ...DEF_LINK, source: 2.1, target: 3.1, prob: 0.34 },
    { ...DEF_LINK, source: 2.1, target: 3.2, prob: 0.5 },
    { ...DEF_LINK, source: 2.2, target: 3.2, prob: 0.5 },
    { ...DEF_LINK, source: 2.2, target: 3.1, prob: 0.33 }
]

interface TreeState {
    currLevel: number;
    balls: number;
    population: number[];
    animation: { layer: number, state: boolean, links: linkLine[] };
}

const initialState: TreeState = {
    currLevel: 1,
    balls: 7,
    population: [
        0, 20, 50,
        0, 10,
        0, 1, 2,
        0, 0, 0
    ],
    animation: {
        layer: 99,
        state: false,
        links: DEF_LINKS
    }
};

const treeSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        setCurrLevel: (state, action: PayloadAction<number>) => ({
            ...state,
            currLevel: action.payload
        }),
        setAnimation: (state, action: PayloadAction<{
            layer: number, state: boolean,
            selLinks?: linkLine[], updatePop?: number[]
        }>) => ({
            ...state,
            animation: {
                ...state.animation,
                layer: action.payload.layer,
                state: action.payload.state,
                links: action.payload.selLinks ? action.payload.selLinks :
                    action.payload.layer === 99 ? DEF_LINKS : state.animation.links.
                        map((l) => { return { ...l, sel: 0, color: l.bonus > 0 ? l.color : DEF_LINK.color } })
            },
            population: action.payload.updatePop ? action.payload.updatePop : state.population,
            balls: action.payload.layer === 99 ? state.balls + 1 : state.balls
        }),
        setSelectedLink: (state, action: PayloadAction<{ select: boolean, s: number, t: number, b: number }>) => ({
            ...state,
            animation: {
                ...state.animation,
                links: state.animation.links.
                    map((l) => {
                        return {
                            ...l, bonus: (action.payload.select && action.payload.t === l.target) ?
                                (action.payload.s === l.source ? action.payload.b : 0.1) : 0,
                            color: (action.payload.select && action.payload.t === l.target) ?
                                (action.payload.s === l.source ? 'blue' : 'red') : DEF_LINK.color
                        }
                    })
            }
        }),
    }
});

export const { setCurrLevel, setSelectedLink, setAnimation } = treeSlice.actions;
export default treeSlice.reducer;
