import React from "react";
import "./levelBuilder.scss";
import { useAppSelector } from "../hooks.ts";
import { Graph } from 'react-d3-graph';
import { useDispatch } from "react-redux";
import { setNodePop } from "../treeReducer.tsx";

export default function LevelBuilder(): JSX.Element {
    const dispatch = useDispatch();
    const currLevel = useAppSelector((state) => state.tree.currLevel);
    const balls = useAppSelector((state) => state.tree.balls);
    const nodePop = useAppSelector((state) => state.tree.population);
    const EMPTY_NODE = { id: 's0', x: 30, y: 30, size: 550, symbolType: 'square', color: 'blue', pop: 0 }

    const nodeString = [
        0.0, 0.1, 0.2,
        1.0, 1.1,
        2.0, 2.1, 2.2,
        3.0, 3.1, 3.2];
    const levels = 4;
    // Define the nodes
    let nodes = nodeString.map((n, index) => {
        const lev = Math.floor(n / 1);
        return {
            ...EMPTY_NODE, id: n, pop: nodePop[index] || '',
            color: lev === 0 ? 'red' : lev === levels - 1 ? 'green' : 'orange',
            symbolType: (lev === 0 || lev === levels - 1) ? 'circle' : 'square',
            x: EMPTY_NODE.x + (n - lev) * 1500,
            y: EMPTY_NODE.y + lev * 150,
        }
    });
    // Define the links
    const links = [
        { source: 0.0, target: 1.0 },
        { source: 0.0, target: 1.1 },
        { source: 0.1, target: 1.1 },
        { source: 0.2, target: 1.1 },

        { source: 1.0, target: 2.0 },
        { source: 1.0, target: 2.1 },
        { source: 1.1, target: 2.1 },
        { source: 1.1, target: 2.2 },

        { source: 2.0, target: 3.0 },
        { source: 2.0, target: 3.1 },
        { source: 2.1, target: 3.0 },
        { source: 2.1, target: 3.1 },
        { source: 2.1, target: 3.2 },
        { source: 2.2, target: 3.2 }
    ];
    // Define the graph data
    const data = {
        nodes: nodes,
        links: links
    };
    // Define the graph configuration
    const config = {
        directed: true,
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 400,
            highlightStrokeColor: 'blue',
            labelProperty: 'pop',
            labelPosition: 'bottom'
        },
        link: {
            highlightColor: 'lightblue',
            type: 'STRAIGHT' //'CURVE_SMOOTH'
        }
    };

    const onClickNode = function (nodeId: string) {
        let tempPop = [...nodePop]
        const index = nodeString.findIndex((n) => n === +nodeId) || 0;
        tempPop[index] += 1;
        dispatch(setNodePop(tempPop));
        // console.log(nodeId,index,nodePop[index])
    };

    const onClickLink = function (source, target) {
        window.alert(`Clicked link between ${source} and ${target}`);
    };

    return (
        <div>
            <h2>Level {currLevel}</h2>
            <Graph
                id="current-level"
                data={data}
                config={config}
                onClickNode={onClickNode}
                onClickLink={onClickLink}
            />
            <h2>balls: {balls}</h2>
        </div>
    );
};