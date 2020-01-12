import React, { Component } from "react";
import CarromCoin from "../models/CarromCoin";
import "./Game.css"

let ctx;
let canvasRef;
let requestId;
let requestIdForMouse;
let gameObjects = [];
let oldTimestamp = 0;
class Game extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mouse = {
            x: undefined,
            y: undefined
        };
    }

    eventRegister = () => {
        document.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left - 400;
            this.mouse.y = event.y - rect.top - 400;
        });

        document.addEventListener("keydown", (event) => {
            console.log(event.keyCode, event.timeStamp);
        });

        document.addEventListener("keyup", (event) => {
            console.log(event.keyCode, event.timeStamp);
        });
    }

    init = () => {
        canvasRef = this.canvas.current;
        ctx = canvasRef.getContext("2d");
        canvasRef.width = 800;
        canvasRef.height = 800;
        ctx.translate(400, 400);

        this.eventRegister();
        this.initCarromBoard();

        console.log(gameObjects);

        // requestAnimationFrame(timeStamp => this.carromLoop(timeStamp));
    }


    componentDidMount() {
        this.init();
        // this.mouseEvent();
    }

    circleCollide = (x1, y1, r1, x2, y2, r2) => {
        let squareCircleDistance = ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
        return squareCircleDistance <= ((r1 + r2) * (r1 + r2))
    }

    detectCollision = () => {
        let obj1, obj2;

        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].isColliding = false;
        }

        for (let i = 0; i < gameObjects.length; i++) {
            obj1 = gameObjects[i];
            for (let j = 0; j < gameObjects.length; j++) {
                obj2 = gameObjects[j];

                if (this.circleCollide(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                }
            }
        }
    }

    initCarromBoard = () => {
        gameObjects = [
            new CarromCoin(ctx, 0, 0, this.props.circle.radius, "DARKRED"),
            new CarromCoin(ctx, 0, 300, this.props.circle.radius * 2, "REBECCAPURPLE"),
            new CarromCoin(ctx, 0, (this.props.circle.radius * 2), this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, 0, (-this.props.circle.radius * 2), this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, 0, ((this.props.circle.radius * 2) + 30), this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, 0, (-(this.props.circle.radius * 2) - 30), this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, 26, this.props.circle.radius, this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, 26, -this.props.circle.radius, this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, 26, ((this.props.circle.radius * 2) + 15), this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, 26, (-(this.props.circle.radius * 2) - 15), this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, -26, this.props.circle.radius, this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, -26, -this.props.circle.radius, this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, -26, ((this.props.circle.radius * 2) + 15), this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, -26, (-(this.props.circle.radius * 2) - 15), this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, 52, 0, this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, 52, (this.props.circle.radius * 2), this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, 52, (-this.props.circle.radius * 2), this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, -52, 0, this.props.circle.radius, "WHEAT"),
            new CarromCoin(ctx, -52, (this.props.circle.radius * 2), this.props.circle.radius, "BLACK"),
            new CarromCoin(ctx, -52, (-this.props.circle.radius * 2), this.props.circle.radius, "BLACK"),
        ];
        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].draw();
        }
    }

    resetBoard = () => {
        this.initCarromBoard();
    }


    carromLoop = (timeStamp) => {
        let secPassed = (timeStamp - oldTimestamp) / 1000;
        oldTimestamp = timeStamp;


        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].update(secPassed);
        }

        ctx.clearRect(-400, -400, canvasRef.width, canvasRef.height);

        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].draw();
        }

        requestId = requestAnimationFrame(timeStamp => this.carromLoop(timeStamp));
    }

    mouseEvent = () => {
        new CarromCoin(ctx, this.mouse.x, this.mouse.y, 10, "green").draw();
        requestIdForMouse = requestAnimationFrame(this.mouseEvent);
    }

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