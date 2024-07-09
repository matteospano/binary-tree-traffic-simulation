import React from "react";
import "./square.scss";

export default function Square(props: { index: number, pop: number, spawn?: boolean }): JSX.Element {
    const { index, pop, spawn } = props;
    const frozen = false; //da reducer

    const freeze = () => {
        // setFiring(true);
        // setTimeout(() => {
        //     setFiring(false);
        // }, 1000);
    }

    return (
        <div id={'S' + index}
            className={"square-slot" + (spawn ? " square-spawn" : "") + (frozen ? " square-frozen" : "")}
            onClick={freeze}>
            <p>{pop || ''}</p>
        </div>
    );
}