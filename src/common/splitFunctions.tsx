import { linkLine } from "../treeReducer";

export function recursiveSplit(N: number, nodeName: number,
    links: linkLine[], tempPop: number[]
): any {
    const nextNodes: linkLine[] = links.filter((l) => l.target === nodeName);
    const splitBalls: number[] = splitN(N, nextNodes.map((l) => l.prob));
    let ind = -1;
    const selLinks: linkLine[] = links.map((l) => {
        if (l.target === nodeName) {
            ind++;
            return { ...l, sel: splitBalls[ind] }
        }
        else return l
    });
    return selLinks;

    // let pop = [...deltaPop];
    // nextNodes.forEach((n, i) => {
    //     const sInd = nodeString.findIndex((node) => node === n.source);
    //     tempPop[sInd] -= splitBalls[i];
    //     if (tempPop[sInd] < 0)
    //         pop = negativeNode(tempPop[sInd], sInd, n.source, pop, links, nodeNames);
    // });
    // setDeltaPop(pop);
    // dispatch(setNodePop(tempPop));
    // console.log(levels, selLinks)
    
}

export function splitN(N: number, prob: number[]): number[] {
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

export function getRanIndex(prob) {
    const sum = prob.reduce((acc, p) => acc + p, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < prob.length; i++) {
        if (r < prob[i]) return i;
        r -= prob[i];
    }
    return prob.length - 1; // Fallback in case of rounding errors
}

export function negativeNode(N: number, negInd: number, nodeId: number,
    pop: number[], links: linkLine[], nodeNames: number[]) {
    if (nodeId > 0.9) { //prima fila esclusa
        const nextNodes: linkLine[] = links.filter((l) => l.target === +nodeId);

        const splitBalls: number[] = splitN(-1 * N,
            nextNodes.map((l) => l.prob));

        nextNodes.forEach((n, i) => {
            const sInd = nodeNames.findIndex((node) => node === n.source)
            pop[sInd] += splitBalls[i];
        });
    }
    pop[negInd] = N; //crea un delta di +N che annulla il negative
    console.log(nodeId, N)
    return (pop);
}