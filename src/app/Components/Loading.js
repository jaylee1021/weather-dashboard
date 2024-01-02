import React from "react";
import ReactLoading from "react-loading";

function LoadingCircle() {
    return (
        <div style={{ justifyContent: 'center', display: 'flex', alignContent: 'center' }}>
            <ReactLoading type="spokes" color="black"
                height={100} width={50} />
        </div>
    );
}

function LoadingSpinningBubble() {
    return (
        <div style={{ justifyContent: 'center', display: 'flex', margin: '300px 0' }}>
            <ReactLoading type="spinningBubbles" color="black"
                width={50} />
        </div>
    );
}

function LoadingLine() {
    return (
        <div style={{ justifyContent: 'center', display: 'flex' }}>
            <ReactLoading type="bubbles" color="black"
                width={50} />
        </div>
    );
}

export { LoadingCircle, LoadingLine, LoadingSpinningBubble };