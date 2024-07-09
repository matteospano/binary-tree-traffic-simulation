import React from "react";
import "./levelBuilder.scss";
import { useAppSelector } from "../hooks.ts";
import { Graph } from 'react-d3-graph';
import { useDispatch } from "react-redux";
import { linkLine, setNodePop } from "../treeReducer.tsx";

export default function LevelBuilder(): JSX.Element {
    const dispatch = useDispatch();
    const currLevel = useAppSelector((state) => state.tree.currLevel);
    const balls = useAppSelector((state) => state.tree.balls);
    const nodePop = useAppSelector((state) => state.tree.population);
    const EMPTY_NODE = { id: 's0', x: 30, y: 30, size: 550, symbolType: 'square', color: 'blue', pop: 0 };

    const nodeString = [
        0.0, 0.1, 0.2,
        1.0, 1.1,
        2.0, 2.1, 2.2,
        3.0, 3.1, 3.2];
    const levels = 4;
    // Define the nodes
    let nodes = nodeString.map((n, index) => {
        const lev = Math.floor(n);
        return {
            ...EMPTY_NODE, id: n, pop: nodePop[index].toString() || '',
            color: lev === 0 ? 'red' : lev === levels - 1 ? 'green' : 'orange',
            symbolType: (lev === 0 || lev === levels - 1) ? 'circle' : 'square',
            x: EMPTY_NODE.x + (n - lev) * 1500,
            y: EMPTY_NODE.y + lev * 150,
        }
    });
    // Define the links
    const links: linkLine[] = [
        { source: 0.0, target: 1.0, prob: 1 },
        { source: 0.0, target: 1.1, prob: 1 },
        { source: 0.1, target: 1.1, prob: 1 },
        { source: 0.2, target: 1.1, prob: 1 },

        { source: 1.0, target: 2.0, prob: 1.0 },
        { source: 1.0, target: 2.1, prob: 0.5 },
        { source: 1.1, target: 2.1, prob: 0.5 },
        { source: 1.1, target: 2.2, prob: 1.0 },

        { source: 2.0, target: 3.0, prob: 0.5 },
        { source: 2.0, target: 3.1, prob: 0.5 },
        { source: 2.1, target: 3.0, prob: 0.5 },
        { source: 2.1, target: 3.1, prob: 0.5 },
        { source: 2.1, target: 3.2, prob: 0.5 },
        { source: 2.2, target: 3.2, prob: 0.5 }
    ];
    // Define the graph data
    const data = {
        nodes: nodes,
        links: links
    };
    // Define the graph configuration
    const config = {
        //directed: true,
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 400,
            highlightStrokeColor: 'blue',
            labelProperty: 'pop',
            labelPosition: 'right'
        },
        link: {
            highlightColor: 'lightblue',
            type: 'STRAIGHT' //'CURVE_SMOOTH'
        }
    };

    const onClickNode = function (nodeId: string) {
        if (+nodeId >= levels - 1) {
            let tempPop = [...nodePop]
            const index: number = nodeString.findIndex((n) => n === +nodeId) || 0;
            const nextNodes: linkLine[] = links.filter((l) => l.target === +nodeId);

            const splitBalls: number[] = splitN(balls, //tempPop[index]
                nextNodes.map((l) => l.prob));
            //console.log(index, balls, splitBalls)

            nextNodes.forEach((n, i) => {
                const sInd = nodeString.findIndex((node) => node === n.source)
                tempPop[sInd] -= splitBalls[i];
                //console.log(tempPop[sInd], sInd, n)
                if (tempPop[sInd] < 0) negativeNode(tempPop[sInd], n.source, tempPop)
            });
            //console.log(index, balls, splitBalls, tempPop)
            dispatch(setNodePop(tempPop));
        }
        //else lo congela
    };

    const onClickLink = function (source, target) {
        window.alert(`Link between ${source} and ${target}, prob:`
            + links.find((l) => l.source === +source && l.target === +target)?.prob);
    };

    function splitN(N: number, prob: number[]): number[] {
        let result = Array(prob.length).fill(0);

        // Calculate the base split without remainder
        prob.forEach((p, i) => {
            result[i] = Math.floor(N * p);
        });
        let remainder = N - result.reduce((acc, val) => acc + val, 0);

        // Distribute the remainder based on probabilities
        while (remainder > 0) {
            const randomIndex = getRanIndex(prob);
            result[randomIndex]++;
            remainder--;
        }
        return result;
    }

    function getRanIndex(prob) {
        const sum = prob.reduce((acc, p) => acc + p, 0);
        let r = Math.random() * sum;
        for (let i = 0; i < prob.length; i++) {
            if (r < prob[i]) return i;
            r -= prob[i];
        }
        return prob.length - 1; // Fallback in case of rounding errors
    }

    function negativeNode(N: number, nodeId: number, pop: number[]) {
        let tempPop = [...pop]
        //     if (nodeId > 0.9) { //prima fila esclusa
        //         const nextNodes: linkLine[] = links.filter((l) => l.target === +nodeId);

        //         const splitBalls: number[] = splitN(-1 * nodePop[negInd],
        //             nextNodes.map((l) => l.prob));
        //         //console.log(index, balls, splitBalls)

        //         nextNodes.forEach((n, i) => {
        //             const sInd = nodeString.findIndex((node) => node === n.source)
        //             tempPop[sInd] -= splitBalls[i];
        //         });
        //         console.log(nodeId, nodePop[negInd], splitBalls, tempPop)
        //         dispatch(setNodePop(tempPop));
        //     }
        //     else
        //         tempPop[negInd] = 0;
        //     dispatch(setNodePop(tempPop));
    }

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