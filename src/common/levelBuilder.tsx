import React from "react";
import "./levelBuilder.scss";
// import Gun from "./gun.tsx";
// import Square from "./square.tsx";
// import { useAppSelector } from "../hooks.ts";
// import Link from "./link.tsx";
import { Graph } from 'react-d3-graph';

export default function LevelBuilder(): JSX.Element {
    //const pop = useAppSelector((state) => state.tree.population);
    const EMPTY_NODE = { id: 's0', x: 50, y: 50, size: 600, symbolType: 'square', color: 'blue' }
    // Define the nodes
    const nodes = [
        { ...EMPTY_NODE, id: 's1', x: 150, y: 150 },
        { ...EMPTY_NODE, id: 's2', x: 350, y: 150 },
        { ...EMPTY_NODE, id: 's3', x: 550, y: 150 },

        { ...EMPTY_NODE, id: 's4', x: 200, y: 350, color: 'orange' },
        { ...EMPTY_NODE, id: 's5', x: 450, y: 350, color: 'orange' }
    ];
    // Define the links
    const links = [
        { source: 's4', target: 's1' },
        { source: 's4', target: 's2' },
        { source: 's4', target: 's3' },
        { source: 's5', target: 's2' },
        { source: 's5', target: 's3' }
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
            labelProperty: 'id'
        },
        link: {
            highlightColor: 'lightblue'
        }
    };

    return (
        <div>
            <h1>Graph Visualization</h1>
            <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={config}
            />
        </div>
    );
};