import React, { Component } from "react";
import "./Game.css"

let ctx;
let canvasRef;
let requestId;
let x = 50;
let dx = 3;
class Game extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    draw = (ctx, x, y, colour) => {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(x, y, this.props.bird.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
    }

    componentDidMount() {
        canvasRef = this.canvas.current;
        ctx = canvasRef.getContext("2d");
        canvasRef.width = (window.innerWidth * (75 / 100));
        canvasRef.height = (window.innerHeight * (75 / 100));

        this.draw(ctx, 50, 100, "red");
        this.draw(ctx, 50, 160, "black");
    }

    componentDidUpdate() {
        canvasRef.width = (window.innerWidth * (75 / 100));
        canvasRef.height = (window.innerHeight * (75 / 100));
    }


    displayWork = () => {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        x += dx;
        if ((x + this.props.bird.radius) > canvasRef.width || x < this.props.bird.radius) {
            dx = -dx;
        }
        this.draw(ctx, x, 100, "red");
        this.draw(ctx, x, 160, "black");
        requestId = requestAnimationFrame(this.displayWork);
    }

    cancel = () => {
        cancelAnimationFrame(requestId);
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        x = 50;
        dx = 3;
        this.draw(ctx, 50, 100, "red");
        this.draw(ctx, 50, 160, "black");
    }

    render() {
        return (
            <div className="game-top">
                <div>
                    <button onClick={this.displayWork}>Animate</button>
                </div>
                <div>
                    <button onClick={this.cancel}>Cancel</button>
                </div>
                <div>
                    <canvas ref={this.canvas} />
                </div>
            </div>
        );
    }
}

export default Game;