// Define the graph configuration
export const config = {
    //directed: true,
    freezeAllDragEvents:true, //staticGraphWithDragAndDrop
    nodeHighlightBehavior: true,
    linkHighlightBehavior: true,
    node: {
        color: 'lightgreen',
        size: 400,
        highlightStrokeColor: 'blue',
        labelProperty: 'pop',
        fontSize: 14,
        highlightFontSize: 15,
        labelPosition: 'right',

    },
    link: {
        highlightColor: "#89CFF0",
        renderLabel: true,
        labelProperty: 'sel',
        fontSize: 15,
        highlightFontSize: 16,
        type: 'STRAIGHT', //'CURVE_SMOOTH'
    }
};

export function graphNodes(nodeNames: number[], levels: number, debugMode: boolean, nodePop: number[]): any[] {
    const EMPTY_NODE = { id: 's0', x: 30, y: 30, size: 550, symbolType: 'square', color: 'blue', pop: 0 };
    return nodeNames.map((n, index) => {
        const layer = Math.floor(n);
        const pop = nodePop[index];
        return {
            ...EMPTY_NODE, id: n, pop: debugMode ? pop.toString() :
                pop > 0 ? pop.toString() : ' ',
            color: layer === 0 ? 'red' : layer === levels ? 'green' : 'orange',
            symbolType: (layer === 0 || layer === levels) ? 'circle' : 'square',
            x: EMPTY_NODE.x + (n - layer) * 1500,
            y: EMPTY_NODE.y + layer * 150,
        }
    });

}