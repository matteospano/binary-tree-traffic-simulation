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
        <div className={"square-slot" + (spawn ? " square-spawn" : "") + (frozen ? " square-frozen" : "")}
            onClick={freeze}>
            {pop && index + ': ' + pop}
        </div>
    );
}