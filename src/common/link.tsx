import React from "react";
import "./link.scss";

export default function Link(props: { from: number, to: number, animation?: boolean }): JSX.Element {
    const dotA = document.getElementById("S" + props.from);
    const dotB = document.getElementById("S" + props.to);

    const topA = dotA?.getBoundingClientRect().top || 0;
    const leftA = dotA?.getBoundingClientRect().left || 0;
    // const topB = dotB?.getBoundingClientRect().top || 0;
    // const leftB = dotB?.getBoundingClientRect().left || 0;
    // const distance = Math.hypot(leftA - leftB, topA - topB);
    // const angle = ((Math.atan2(leftA - leftB, topA - topB) + (Math.PI / 2.0)) * 180 / Math.PI);
    const distance = 10;
    const angle = 0;

    var line = document.createElement("div");
    line.setAttribute("id", "line");
    line.style.width = distance + "px";
    line.style.left = leftA + "px";
    line.style.top = topA + "px";
    line.style.transform = "rotate(" + angle + "deg)";
    line.style.display = "block";

    //console.log(leftA - leftB, topA - topB, distance, angle);
    return <></>;
}