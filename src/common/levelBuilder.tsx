import React, { useEffect, useState } from "react";
import "./levelBuilder.scss";
import { useAppSelector } from "../hooks.ts";
import { Graph } from 'react-d3-graph';
import { useDispatch } from "react-redux";
import { linkLine, setAnimation, setNodePop } from "../treeReducer.tsx";
import { config, graphNodes } from "./properties.tsx";
import { recursiveSplit, splitN } from "./splitFunctions.tsx";

export default function LevelBuilder(): JSX.Element {
    const dispatch = useDispatch();
    const currLevel = useAppSelector((state) => state.tree.currLevel);
    const balls = useAppSelector((state) => state.tree.balls);
    const nodePop = useAppSelector((state) => state.tree.population);
    const anim = useAppSelector((state) => state.tree.animation);
    //const [nodeComp, setNodes] = useState<any[]>([]);
    const debugMode = true;

    useEffect(() => {
        if (anim.state)
            setTimeout(() => {
                let updatePop = [...nodePop];
                anim.links.forEach((l: linkLine, i) => {
                    if (l.sel > 0) {
                        const nodeId = nodeNames.findIndex((n) => n === l.source)
                        updatePop[nodeId] -= l.sel;
                    }
                });
                dispatch(setAnimation({ layer: anim.layer === 1 ? 99 : anim.layer, state: false, updatePop }));
            }, anim.layer === 1 ? 300 : debugMode ? 1600 : 1600);
        else if (anim.layer != 99) { // fai ripartire la ricorsione            
            let selLinks = [...anim.links];
            let updatePop = [...nodePop];
            nodePop.forEach((pop, nodeId) => {
                if (pop < 0) {
                    const nodeName = nodeNames[nodeId];
                    selLinks = recursiveSplit(pop, nodeName, selLinks, updatePop);
                    updatePop[nodeId] = 0;
                }
            })
            dispatch(setAnimation({ layer: anim.layer - 1, state: true, selLinks, updatePop }));
        }
    }, [anim.state]);

    const nodeNames = [
        0.0, 0.1, 0.2,
        1.0, 1.1,
        2.0, 2.1, 2.2,
        3.0, 3.1, 3.2];
    const levels = Math.floor(nodeNames[nodeNames.length - 1]);

    const onClickNode = function (nodeName: string) {
        console.log(+nodeName)
        if (+nodeName >= levels && anim.layer === 99) {
            const selLinks = recursiveSplit(balls, +nodeName, anim.links, nodePop);
            dispatch(setAnimation({ layer: levels, state: true, selLinks }));
        }
        //else lo congela
    };

    const onClickLink = function (source, target) {
        //prob 3/4 - 1/4
        window.alert(`Link between ${source} and ${target}, prob:`
            + anim.links.find((l) => l.source === +source && l.target === +target)?.prob);
    };

    return (
        <div>
            <h2>Level {currLevel}</h2>
            <Graph
                id="current-level"
                data={{
                    nodes: graphNodes(nodeNames, levels, debugMode, nodePop),
                    links: anim.links
                }}
                config={config}
                onClickNode={onClickNode}
                onClickLink={onClickLink} />
            <h2>balls: {balls} Animation: {anim.layer}{anim.state ? '...' : 'x'}</h2>
        </div>
    );
};