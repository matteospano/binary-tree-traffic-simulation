import React, { useEffect } from "react";
import "./levelBuilder.scss";
import { useAppSelector } from "../hooks.ts";
import { Graph } from 'react-d3-graph';
import { useDispatch } from "react-redux";
import { linkLine, setAnimation, setSelectedLink } from "../treeReducer.tsx";
import { config, graphNodes } from "./properties.tsx";
import { recursiveSplit } from "./splitFunctions.tsx";

export default function LevelBuilder(): JSX.Element {
    const dispatch = useDispatch();
    const currLevel = useAppSelector((state) => state.tree.currLevel);
    const balls = useAppSelector((state) => state.tree.balls);
    const nodePop = useAppSelector((state) => state.tree.population);
    const anim = useAppSelector((state) => state.tree.animation);
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
                dispatch(setAnimation({ layer: anim.layer === 0 ? 99 : anim.layer, state: false, updatePop }));
            }, anim.layer === 0 ? 300 : debugMode ? 2000 : 1500);
        else if (anim.layer != 99) { // fai ripartire la ricorsione            
            let selLinks = [...anim.links];
            let updatePop = [...nodePop];
            nodePop.forEach((pop, nodeId) => {
                if (pop < 0) {
                    const nodeName = nodeNames[nodeId];
                    selLinks = recursiveSplit(-pop, nodeName, selLinks);
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
            const selLinks = recursiveSplit(balls, +nodeName, anim.links);
            dispatch(setAnimation({ layer: levels, state: true, selLinks }));
        }
        //else lo congela
    };

    const onClickLink = function (source: string, target: string) {
        const s: number = +source;
        const t: number = +target;
        if (anim.links.find((l) => l.bonus > 0))
            dispatch(setSelectedLink({ select: false, s, t, b: 0 }));
        else {
            const linkProb = anim.links.find((l) => l.source === s && l.target === t)?.prob || 1;
            const b = Math.round(linkProb * 10 + (Math.round(1 / linkProb) - 1) * (linkProb * 10 - 1)) / 10;
            //bonus 5 links: 0.2-> 0.6, 4 links: 0.25-> 0.7, 3 links: 0.33/34-> 0.8, 2 links: 0.5-> 0.9
            dispatch(setSelectedLink({ select: true, s, t, b }));
        }
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
            <h2>balls: {balls}{debugMode && ' animation: ' + anim.layer + (anim.state ? '...' : 'x')}</h2>
        </div>
    );
};