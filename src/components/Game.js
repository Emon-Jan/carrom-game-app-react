import React, { Component } from "react";
import CarromCoin from "../models/CarromCoin";
import "./Game.css"

let ctx;
let canvasRef;
let requestId;
let requestIdForMouse;
let gameObjects = [];
let oldTimestamp = 0;
let count = 0;
class Game extends Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mouse = {
            x: undefined,
            y: undefined
        };
        this.pos = [
            { pX: 0, pY: 0, pCol: "DARKRED" },
            { pX: 0, pY: (this.props.circle.radius * 2), pCol: "WHEAT" },
            { pX: 0, pY: (-this.props.circle.radius * 2), pCol: "BLACK" },
            { pX: 0, pY: ((this.props.circle.radius * 2) + 30), pCol: "BLACK" },
            { pX: 0, pY: (-(this.props.circle.radius * 2) - 30), pCol: "BLACK" },
            { pX: 26, pY: this.props.circle.radius, pCol: "BLACK" },
            { pX: 26, pY: -this.props.circle.radius, pCol: "WHEAT" },
            { pX: 26, pY: ((this.props.circle.radius * 2) + 15), pCol: "WHEAT" },
            { pX: 26, pY: (-(this.props.circle.radius * 2) - 15), pCol: "WHEAT" },
            { pX: -26, pY: this.props.circle.radius, pCol: "BLACK" },
            { pX: -26, pY: -this.props.circle.radius, pCol: "WHEAT" },
            { pX: -26, pY: ((this.props.circle.radius * 2) + 15), pCol: "WHEAT" },
            { pX: -26, pY: (-(this.props.circle.radius * 2) - 15), pCol: "WHEAT" },
            { pX: 52, pY: 0, pCol: "WHEAT" },
            { pX: 52, pY: (this.props.circle.radius * 2), pCol: "BLACK" },
            { pX: 52, pY: (-this.props.circle.radius * 2), pCol: "BLACK" },
            { pX: -52, pY: 0, pCol: "WHEAT" },
            { pX: -52, pY: (this.props.circle.radius * 2), pCol: "BLACK" },
            { pX: -52, pY: (-this.props.circle.radius * 2), pCol: "BLACK" },
        ];
    }

    eventRegister = () => {
        document.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left - 400;
            this.mouse.y = event.y - rect.top - 400;
        });

        document.addEventListener("keydown", (event) => {
            console.log(event.keyCode, event.timeStamp, count);
            if (event.keyCode === 37) {
                gameObjects[this.pos.length].vx -= 10;
            }
            if (event.keyCode === 39) {
                gameObjects[this.pos.length].vx += 10;
            }
            if (event.keyCode === 32) {
                count++;
                if (count > 5 && count < 10) {
                    gameObjects[this.pos.length].vy -= 3;
                }
                if (count > 10 && count < 20) {
                    gameObjects[this.pos.length].vy -= 5;
                }
            }

        });

        document.addEventListener("keyup", (event) => {
            console.log(event.keyCode, event.timeStamp);

            // if (gameObjects[this.pos.length].vx < 0) {
            gameObjects[this.pos.length].vx = 0;
            // }
            // gameObjects[this.pos.length].vy += 10;
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

        requestAnimationFrame(this.carromLoop);
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
                if (obj1 === obj2) continue;

                if (this.circleCollide(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                    obj1.isColliding = true;
                    obj2.isColliding = true;
                    let friction = 0.8;
                    let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
                    let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
                    let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
                    let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                    if (speed < 0) {
                        break;
                    }

                    let impulse = 2 * speed / (obj1.mass + obj2.mass);
                    // obj1.vx -= (friction * impulse * obj2.mass * vCollisionNorm.x);
                    // obj1.vy -= (friction * impulse * obj2.mass * vCollisionNorm.y);
                    // obj2.vx += (friction * impulse * obj1.mass * vCollisionNorm.x);
                    // obj2.vy += (friction * impulse * obj1.mass * vCollisionNorm.y);
                    if (obj1.vx !== 0 || obj2.vx !== 0 || obj1.vy !== 0 || obj2.vy !== 0) {
                        obj1.vx -= (friction * impulse * obj2.mass * vCollisionNorm.x);
                        obj1.vy -= (friction * impulse * obj2.mass * vCollisionNorm.y);
                        obj2.vx += (friction * impulse * obj1.mass * vCollisionNorm.x);
                        obj2.vy += (friction * impulse * obj1.mass * vCollisionNorm.y);
                    }
                    // console.log(speed);

                }
            }
        }
    }

    carromBoundary = () => {
        gameObjects.forEach(el => {
            if (el.y - el.radius <= -400 || el.y + el.radius >= 400) {
                el.vy = -el.vy
            }
            if (el.x - el.radius <= -400 || el.x + el.radius >= 400) {
                el.vx = -el.vx
            }
        });
    }

    initCarromBoard = () => {
        for (let index = 0; index < this.pos.length; index++) {
            gameObjects[index] = new CarromCoin(ctx, this.pos[index].pX, this.pos[index].pY, this.props.circle.radius, this.pos[index].pCol, 3);
            gameObjects[index].draw();
        }
        gameObjects[this.pos.length] = new CarromCoin(ctx, 0, 300, this.props.circle.radius * 2, "REBECCAPURPLE", 2);
        gameObjects[this.pos.length].draw();
    }

    resetBoard = () => {
        this.initCarromBoard();
    }


    carromLoop = () => {
        // let secPassed = (timeStamp - oldTimestamp) / 1000;
        // oldTimestamp = timeStamp;


        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].update();
        }
        this.carromBoundary();
        this.detectCollision();
        ctx.clearRect(-400, -400, canvasRef.width, canvasRef.height);

        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].draw();
        }

        requestId = requestAnimationFrame(this.carromLoop);
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

export default Game;