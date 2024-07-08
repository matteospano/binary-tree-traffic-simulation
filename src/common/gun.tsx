import React from "react";
import "./gun.scss";

export default function Gun(props: { index: number }): JSX.Element {
    const { index } = props;

    return (
        <div className="gun-circle">
            G{index}
        </div>
    );
}