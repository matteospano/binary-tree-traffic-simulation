import { linkLine } from "../treeReducer";

export function recursiveSplit(N: number, nodeName: number, links: linkLine[]): any {
    const nextNodes: linkLine[] = links.filter((l) => l.target === nodeName);
    const splitBalls: number[] = splitN(N, nextNodes.map((l) => l.bonus || l.prob));
    let ind = -1;
    const selLinks: linkLine[] = links.map((l) => {
        if (l.target === nodeName) {
            ind++;
            return { ...l, sel: splitBalls[ind], color: (l.bonus === 0 && splitBalls[ind] > 0) ? 'black' : l.color }
        }
        else return l
    });
    return selLinks;
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