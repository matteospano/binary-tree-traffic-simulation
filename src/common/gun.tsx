import React, { useState } from "react";
import "./gun.scss";

export default function Gun(props: { index: number }): JSX.Element {
    const { index } = props;
    const [firing, setFiring] = useState<boolean>(false);

    const fire = () => {
        setFiring(true);
        setTimeout(() => {
            setFiring(false);
        }, 1000);
    }

    return (
        <div className={"gun-circle" + (firing ? " gun-firing" : "")}
            onClick={fire}>
            G{index}{firing ? "!" : ""}
        </div>
    );
}