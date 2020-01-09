import React, { Component } from "react";
import "./Game.css"

let ctx;
let canvasRef;
let requestId;
let requestIdForMouse;
let x = 200;
let y = 30;
let whiteCircle = 9;
class Game extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mouse = {
            x: undefined,
            y: undefined
        };
    }

    draw = (x, y, radius, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
    }

    componentDidMount() {
        canvasRef = this.canvas.current;
        ctx = canvasRef.getContext("2d");
        canvasRef.width = 800;
        canvasRef.height = 800;
        ctx.translate(400, 400);
        // this.draw(ctx, 50, 100, this.props.bird.radius, "red");
        // this.draw(ctx, 50, 160, this.props.bird.radius, "black");

        document.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left - 400;
            this.mouse.y = event.y - rect.top - 400;
        });

        this.displayWork();
        this.mouseEvent();
    }

    showArc = () => {
        for (let i = 0; i < 3; i++) {
            this.draw(0, y, this.props.bird.radius, "Grey");
            ctx.rotate(2 * Math.PI / 3);
        }
        for (let i = 0; i < 3; i++) {
            this.draw(27, (y - 15), this.props.bird.radius, "Black");
            ctx.rotate(2 * Math.PI / 3);
        }
        for (let i = 0; i < 3; i++) {
            this.draw(54, (y - 30), this.props.bird.radius, "Grey");
            ctx.rotate(2 * Math.PI / 3);
        }
        for (let i = 0; i < 3; i++) {
            this.draw(27, (y + 15), this.props.bird.radius, "Black");
            ctx.rotate(2 * Math.PI / 3);
        }
        for (let i = 0; i < 3; i++) {
            this.draw(0, (y + 30), this.props.bird.radius, "Grey");
            ctx.rotate(2 * Math.PI / 3);
        }
        for (let i = 0; i < 3; i++) {
            this.draw(54, y, this.props.bird.radius, "BLACK");
            ctx.rotate(2 * Math.PI / 3);
        }

    }


    displayWork = () => {
        ctx.clearRect(-400, -400, canvasRef.width, canvasRef.height);
        this.showArc();
        this.draw(0, 0, this.props.bird.radius, "DARKORANGE");
        requestId = requestAnimationFrame(this.displayWork);
    }

    mouseEvent = () => {
        this.draw(this.mouse.x, this.mouse.y, 10, "green");
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