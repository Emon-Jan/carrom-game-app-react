import React, { Component } from "react";
import "./Game.css"

let ctx;
let canvasRef;
let requestId;
let requestIdForMouse;
let x = 0;
class Game extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mouse = {
            x: undefined,
            y: undefined
        };

    }

    draw = (x, y, radius, color, items) => {
        for (let i = 0; i < items; i++) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.stroke();
            x += radius * 2;
            y += radius * 2;
        }
    }

    componentDidMount() {
        canvasRef = this.canvas.current;
        ctx = canvasRef.getContext("2d");
        canvasRef.width = 600;
        canvasRef.height = 600;

        // this.draw(ctx, 50, 100, this.props.bird.radius, "red");
        // this.draw(ctx, 50, 160, this.props.bird.radius, "black");

        document.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left;
            this.mouse.y = event.y - rect.top;
        });

        this.displayWork();
        this.mouseEvent();
    }


    displayWork = () => {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        // x += dx;
        // if ((x + this.props.bird.radius) > canvasRef.width || x < this.props.bird.radius) {
        //     dx = -dx;
        // }
        this.draw(x, 100, this.props.bird.radius, "MEDIUMSLATEBLUE", 9);
        this.draw(x, 160, this.props.bird.radius, "DARKSLATEGRAY", 9);
        this.draw(x, 200, this.props.bird.radius, "RED", 1);
        requestId = requestAnimationFrame(this.displayWork);
    }

    mouseEvent = () => {
        this.draw(this.mouse.x, this.mouse.y, 10, "green", 1);
        requestIdForMouse = requestAnimationFrame(this.mouseEvent);
    }

    // cancel = () => {
    //     cancelAnimationFrame(requestId);
    //     cancelAnimationFrame(requestIdForMouse);
    //     ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    //     x = 50;
    //     // dx = 3;
    //     this.draw(ctx, 50, 100, "red");
    //     this.draw(ctx, 50, 160, "black");
    //     this.draw(ctx, 50, 220, "green");
    // }

    render() {
        return (
            <div className="game-top">
                <canvas ref={this.canvas} />
            </div>
        );
    }
}
// onClick={this.displayWork}

export default Game;