import React, { useEffect, useState } from "react";
import "./levelBuilder.scss";
import { useAppSelector } from "../hooks.ts";
import { Graph } from 'react-d3-graph';
import { useDispatch } from "react-redux";
import { linkLine, setAnimation, setNodePop } from "../treeReducer.tsx";

export default function LevelBuilder(): JSX.Element {
    const dispatch = useDispatch();
    const currLevel = useAppSelector((state) => state.tree.currLevel);
    const balls = useAppSelector((state) => state.tree.balls);
    const nodePop = useAppSelector((state) => state.tree.population);
    const anim = useAppSelector((state) => state.tree.animation);
    const EMPTY_NODE = { id: 's0', x: 30, y: 30, size: 550, symbolType: 'square', color: 'blue', pop: 0 };
    const [deltaPop, setDeltaPop] = useState<number[]>(new Array(nodePop.length).fill(0));

    useEffect(() => {
        if (anim.state)
            setTimeout(() => {
                dispatch(setAnimation({ layer: anim.layer === 1 ? 99 : anim.layer, state: false }));
            }, 1600);
        else if (deltaPop.some((d) => d != 0)) {
            let updatePop = [...nodePop];
            deltaPop.forEach((d, i) => {
                updatePop[i] -= d;
            })
            setDeltaPop(new Array(nodePop.length).fill(0));
            dispatch(setNodePop(updatePop));


            if (anim.layer >= 0) {
                const currLayer = anim.layer - 1;
                const nodeLayer = nodeString.filter((n) => Math.floor(n) === currLayer - 1);

                let tempPop = [...updatePop];
                let pop = new Array(nodePop.length).fill(0);
                let selLinks = [...anim.links]
                nodeLayer.forEach((nodeId) => {
                    const sInd = nodeString.findIndex((node) => node == nodeId);
                    if (tempPop[sInd] < 0) {
                        const nextNodes: linkLine[] = anim.links.filter((l) => l.target === +nodeId);
                        const splitBalls: number[] = splitN(-1 * tempPop[sInd], nextNodes.map((l) => l.prob));
                        selLinks = selLinks.map((l) => {
                            let ind = -1;
                            if (l.target === +nodeId) {
                                ind++;
                                return { ...l, sel: splitBalls[ind] }
                            }
                            else
                                return l
                        });

                        pop[sInd] += tempPop[sInd];
                        console.log(splitBalls)
                        nextNodes.forEach((n, i) => {
                            const sInd = nodeString.findIndex((node) => node === n.source);
                            tempPop[sInd] -= splitBalls[i];
                            if (tempPop[sInd] < 0)
                                pop = negativeNode(tempPop[sInd], sInd, n.source, pop);
                        });
                    }
                })
                dispatch(setAnimation({ layer: currLayer, state: true, links: selLinks }));
                //debugger
                setDeltaPop(pop);
                dispatch(setNodePop(tempPop));
            }
        }
    }, [anim])

    const nodeString = [
        0.0, 0.1, 0.2,
        1.0, 1.1,
        2.0, 2.1, 2.2,
        3.0, 3.1, 3.2];
    const levels = 4;
    // Define the nodes
    let nodes = nodeString.map((n, index) => {
        const layer = Math.floor(n);
        return {
            ...EMPTY_NODE, id: n, pop: nodePop[index] > 0 ? nodePop[index].toString() : ' ',
            color: layer === 0 ? 'red' : layer === levels - 1 ? 'green' : 'orange',
            symbolType: (layer === 0 || layer === levels - 1) ? 'circle' : 'square',
            x: EMPTY_NODE.x + (n - layer) * 1500,
            y: EMPTY_NODE.y + layer * 150,
        }
    });
    // Define the graph data
    const data = {
        nodes: nodes,
        links: anim.links
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
            fontSize: 11,
            labelPosition: 'right'
        },
        link: {
            color: "#d3d3d3", //(link) => link.sel ? 'blue' : "#d3d3d3",
            highlightColor: 'lightblue',
            renderLabel: true,
            labelProperty: 'sel',
            fontSize: 11,
            type: 'STRAIGHT' //'CURVE_SMOOTH'
        }
    };

    const onClickNode = function (nodeId: string) {
        if (+nodeId >= levels - 1 && anim.layer === 99) {
            let tempPop = [...nodePop]
            const nextNodes: linkLine[] = anim.links.filter((l) => l.target === +nodeId);
            const splitBalls: number[] = splitN(balls,nextNodes.map((l) => l.prob));
            const selLinks = [...anim.links].map((l) => {
                let ind = -1;
                if (l.target === +nodeId) {
                    ind++;
                    return { ...l, sel: splitBalls[ind] }
                }
                else
                    return l
            });

            dispatch(setAnimation({ layer: levels - 1, state: true, links: selLinks }));

            let pop = [...deltaPop];
            nextNodes.forEach((n, i) => {
                const sInd = nodeString.findIndex((node) => node === n.source);
                tempPop[sInd] -= splitBalls[i];
                if (tempPop[sInd] < 0)
                    pop = negativeNode(tempPop[sInd], sInd, n.source, pop);
            });
            setDeltaPop(pop);
            dispatch(setNodePop(tempPop));
        }
        //else lo congela
    };

    const onClickLink = function (source, target) {
        window.alert(`Link between ${source} and ${target}, prob:`
            + anim.links.find((l) => l.source === +source && l.target === +target)?.prob);
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

    function negativeNode(N: number, negInd: number, nodeId: number, pop: number[]) {
        if (nodeId > 0.9) { //prima fila esclusa
            const nextNodes: linkLine[] = anim.links.filter((l) => l.target === +nodeId);

            const splitBalls: number[] = splitN(-1 * N,
                nextNodes.map((l) => l.prob));

            nextNodes.forEach((n, i) => {
                const sInd = nodeString.findIndex((node) => node === n.source)
                pop[sInd] += splitBalls[i];
            });
        }
        pop[negInd] = N; //crea un delta di +N che annulla il negative
        console.log(nodeId, N)
        return (pop);
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
            <h2>balls: {balls} Animation: {anim.layer}{anim.state ? '...' : 'x'}</h2>
        </div>
    );
};