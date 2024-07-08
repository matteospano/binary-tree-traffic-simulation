import React from "react";
import "./levelBuilder.scss";
import Gun from "./gun.tsx";
import Square from "./square.tsx";

export default function LevelBuilder(): JSX.Element {
    return (
        <span>
            <p className="squares">
                <Square index={5} pop={0} spawn />
                <Square index={6} pop={10} spawn />
                <Square index={7} pop={40} spawn />
            </p>
            <p className="squares">
                <Square index={3} pop={0} />
                <Square index={4} pop={20} />
            </p>
            <p className="squares">
                <Square index={2} pop={0} />
                <Square index={1} pop={0} />
                <Square index={0} pop={0} />
            </p>
            <p className="guns">
                <Gun index={0} />
                <Gun index={1} />
                <Gun index={2} />
            </p>
        </span>
    );
}