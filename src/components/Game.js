import React, { Component } from "react";
import "./Game.css"
import CarromCoin from "../models/CarromCoin";

let ctx;
let canvasRef;
let requestId;
let requestIdForMouse;
let x = 200;
let y = 30;
let gameObjects = [];
let pos = [
    { cX: 0, cY: 0, col: "WHEAT" },
    { cX: 27, cY: -15, col: "Black" },
    { cX: 54, cY: -30, col: "WHEAT" },
    { cX: 27, cY: 15, col: "Black" },
    { cX: 0, cY: 30, col: "WHEAT" },
    { cX: 54, cY: 0, col: "Black" },
]
class Game extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mouse = {
            x: undefined,
            y: undefined
        };
    }

    componentDidMount() {
        canvasRef = this.canvas.current;
        ctx = canvasRef.getContext("2d");
        canvasRef.width = 800;
        canvasRef.height = 800;
        ctx.translate(400, 400);

        document.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left - 400;
            this.mouse.y = event.y - rect.top - 400;
        });

        this.displayWork();
        this.mouseEvent();
    }

    createCarromCoin = () => {
        let i = 0;
        let count = 0;
        while (i < 6) {
            for (let j = 0; j < 3; j++) {
                gameObjects[count] = new CarromCoin(ctx, pos[i].cX, (y + pos[i].cY), this.props.bird.radius, pos[i].col);
                gameObjects[count].draw();
                ctx.rotate(2 * Math.PI / 3);
                count++;
            }
            i++;
        }
    }


    displayWork = () => {
        ctx.clearRect(-400, -400, canvasRef.width, canvasRef.height);
        this.createCarromCoin();
        gameObjects[18] = new CarromCoin(ctx, 0, 0, this.props.bird.radius, "DARKRED");
        gameObjects[18].draw();
        requestId = requestAnimationFrame(this.displayWork);
    }

    mouseEvent = () => {
        new CarromCoin(ctx, this.mouse.x, this.mouse.y, 10, "green").draw();
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