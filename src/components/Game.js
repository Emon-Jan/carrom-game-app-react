import React, { Component } from "react";
import "./Game.css";

import CarromCoin from "../models/CarromCoin";
import StrikerCoin from "../models/StrikerCoin";

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import ProgressBar from 'react-bootstrap/ProgressBar'

import hit from "../assets/Hit.wav";
import pock from "../assets/Pocket.wav"
import BoardImage from "../assets/carrom.png";

let ctx;
let image;
let canvasRef;
let strikeSound;
let pocketSound;

let keys = [];
let hole = [];
let gameObjects = [];

let friction = 0.4;
let strike = false;

class Game extends Component {
    state = {
        circle: {
            radius: 16
        },
        power: 0
    }

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.mouse = {
            x: undefined,
            y: undefined
        };

        this.pos = [
            { pX: 0, pY: 0, pCol: "DARKRED" },
            { pX: 0, pY: (this.state.circle.radius * 2), pCol: "WHEAT" },
            { pX: 0, pY: (-this.state.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: 0, pY: ((this.state.circle.radius * 2) + 32), pCol: "DARKSLATEGRAY" },
            { pX: 0, pY: (-(this.state.circle.radius * 2) - 32), pCol: "DARKSLATEGRAY" },
            { pX: 27, pY: this.state.circle.radius, pCol: "DARKSLATEGRAY" },
            { pX: 27, pY: -this.state.circle.radius, pCol: "WHEAT" },
            { pX: 27, pY: ((this.state.circle.radius * 2) + 16), pCol: "WHEAT" },
            { pX: 27, pY: (-(this.state.circle.radius * 2) - 16), pCol: "WHEAT" },
            { pX: -27, pY: this.state.circle.radius, pCol: "DARKSLATEGRAY" },
            { pX: -27, pY: -this.state.circle.radius, pCol: "WHEAT" },
            { pX: -27, pY: ((this.state.circle.radius * 2) + 16), pCol: "WHEAT" },
            { pX: -27, pY: (-(this.state.circle.radius * 2) - 16), pCol: "WHEAT" },
            { pX: 54, pY: 0, pCol: "WHEAT" },
            { pX: 54, pY: (this.state.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: 54, pY: (-this.state.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: -54, pY: 0, pCol: "WHEAT" },
            { pX: -54, pY: (this.state.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: -54, pY: (-this.state.circle.radius * 2), pCol: "DARKSLATEGRAY" },
        ];
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        canvasRef = this.canvas.current;
        strikeSound = new Audio(hit);
        pocketSound = new Audio(pock);
        canvasRef.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left - 400;
            this.mouse.y = event.y - rect.top - 400;
        });

        document.addEventListener("keydown", (event) => {
            // console.log(event.keyCode, event.timeStamp, event.which);
            keys[event.keyCode] = true;
        });

        document.addEventListener("keyup", (event) => {
            // console.log(event.keyCode, event.timeStamp);
            keys[event.keyCode] = false;
        });

        ctx = canvasRef.getContext("2d");
        image = new Image();
        image.src = BoardImage;

        canvasRef.width = 800;
        canvasRef.height = 800;
        ctx.translate(400, 400);
        this.initCarromBoard();

        // console.log(gameObjects);

        image.onload = () => {
            requestAnimationFrame(this.carromLoop);
        };
    }

    initCarromBoard = () => {
        strike = false;
        this.setState({ power: 0 });
        for (let index = 0; index < this.pos.length; index++) {
            gameObjects[index] = new CarromCoin(ctx, this.pos[index].pX, this.pos[index].pY, this.state.circle.radius, this.pos[index].pCol, 10);
            gameObjects[index].draw();
        }
        gameObjects[this.pos.length] = new StrikerCoin(ctx, 0, 225, this.state.circle.radius + 10, "GAINSBORO", 10);
        gameObjects[this.pos.length].draw();

        hole = [
            new CarromCoin(ctx, -325, -325, 25, "WHITE", 1),
            new CarromCoin(ctx, 325, -325, 25, "WHITE", 1),
            new CarromCoin(ctx, -325, 325, 25, "WHITE", 1),
            new CarromCoin(ctx, 325, 325, 25, "WHITE", 1),
        ];

        for (let index = 0; index < hole.length; index++) {
            hole[index].draw();
        }

    }

    carromBoundary = () => {
        gameObjects.forEach(el => {
            if (el.x + el.vx < -350 + el.radius || el.x + el.vx > 350 - el.radius) {
                el.vx = -el.vx
            }
            if (el.y + el.vy < -350 + el.radius || el.y + el.vy > 350 - el.radius) {
                el.vy = -el.vy
            }
        });
    }

    applyFriction = (obj) => {
        let speed = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy),
            angle = Math.atan2(obj.vy, obj.vx);
        if (speed > friction) {
            speed -= friction;
        } else {
            speed = 0;
        }
        obj.vx = Math.cos(angle) * speed;
        obj.vy = Math.sin(angle) * speed;
    }

    strikerMovement = () => {
        if (keys[37] && (gameObjects[gameObjects.length - 1].x - this.state.circle.radius) > -200) {
            gameObjects[gameObjects.length - 1].x -= 5;
        }
        else if (keys[39] && (gameObjects[gameObjects.length - 1].x + this.state.circle.radius) < 200) {
            gameObjects[gameObjects.length - 1].x += 5;
        }
        else if (keys[38]) {
            if (this.state.power < 100) {
                this.setState({ power: this.state.power + 1 })
            }
        }
        else if (keys[40]) {
            if (this.state.power > 0) {
                this.setState({ power: this.state.power - 1 })
            }
        }
        // console.log(this.power);

        if (keys[32] && !strike && this.state.power) {
            strikeSound.play();
            gameObjects[gameObjects.length - 1].vx = Math.cos(gameObjects[gameObjects.length - 1].angle) * this.state.power;
            gameObjects[gameObjects.length - 1].vy = Math.sin(gameObjects[gameObjects.length - 1].angle) * this.state.power;
            strike = true;
        }
    }

    resetBoard = () => {
        this.initCarromBoard();
    }

    circleCollide = (x1, y1, r1, x2, y2, r2) => {
        let squareCircleDistance = ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
        return squareCircleDistance <= ((r1 + r2) * (r1 + r2));
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
                    let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
                    let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));
                    let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
                    let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
                    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                    if (speed < 0) { break; }

                    let impulse = 2 * speed / (obj1.mass + obj2.mass);
                    obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                    obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                    obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                    obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
                }
            }
        }
    }

    detectCollisionWithHole = () => {
        let obj1, obj2;

        for (let i = 0; i < gameObjects.length; i++) {
            obj1 = gameObjects[i];

            for (let j = 0; j < hole.length; j++) {
                obj2 = hole[j];

                if (this.circleCollide(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)) {
                    let xNegyNeg = (obj2.x < obj2.radius && obj2.y < obj2.radius) && (obj2.x >= obj1.x || obj2.y >= obj1.y);
                    let xPoxyNeg = (obj2.x > obj2.radius && obj2.y < obj2.radius) && (obj2.x <= obj1.x || obj2.y >= obj1.y);
                    let xNegyPos = (obj2.x < obj2.radius && obj2.y > obj2.radius) && (obj2.x >= obj1.x || obj2.y <= obj1.y);
                    let xPosyPos = (obj2.x > obj2.radius && obj2.y > obj2.radius) && (obj2.x <= obj1.x || obj2.y <= obj1.y);

                    if (xNegyNeg) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                            pocketSound.play();
                        }
                    }
                    if (xPoxyNeg) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                            pocketSound.play();
                        }
                    }
                    if (xNegyPos) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                            pocketSound.play();
                        }
                    }
                    if (xPosyPos) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                            pocketSound.play();
                        }
                    }
                }
            }
        }
    }

    carromLoop = () => {
        if (strike && (gameObjects[gameObjects.length - 1].vx === 0 && gameObjects[gameObjects.length - 1].vy === 0)) {
            gameObjects[gameObjects.length - 1].x = 0;
            gameObjects[gameObjects.length - 1].y = 225;
            this.setState({ power: 0 });
            strike = false;
        }
        for (let index = 0; index < gameObjects.length; index++) {
            if (index !== (gameObjects.length - 1)) {
                gameObjects[index].update();
            } else {
                gameObjects[index].update(this.mouse.x, this.mouse.y);
            }
            this.applyFriction(gameObjects[index]);
        }
        this.carromBoundary();
        this.detectCollision();
        this.detectCollisionWithHole();
        this.strikerMovement();
        ctx.clearRect(-400, -400, canvasRef.width, canvasRef.height);

        ctx.drawImage(image, -400, -400, 800, 800);

        for (let index = 0; index < hole.length; index++) {
            hole[index].draw();
        }
        for (let index = 0; index < gameObjects.length; index++) {
            gameObjects[index].draw();
        }
        requestAnimationFrame(this.carromLoop);
    }

    render() {
        let vari = "primary";
        if (33 < this.state.power && this.state.power < 66) {
            vari = "warning"
        }
        else if (this.state.power > 66) {
            vari = "danger"
        }
        return (
            <Container fluid="true" >
                <Row>
                    <Col lg="2">
                        <h3 className="text-color-a">Play with Key-Board & Mouse</h3>
                        <h5 className="text-color-b"><kbd>Space-Bar</kbd> - Shoot </h5>
                        <h5 className="text-color-b"><kbd>Up-Arrow</kbd> - Power Up </h5>
                        <h5 className="text-color-b"><kbd>Down-Arrow</kbd> - Power Down </h5>
                        <h5 className="text-color-b"><kbd>Left-Arrow</kbd> - Move Left </h5>
                        <h5 className="text-color-b"><kbd>Right-Arrow</kbd> - Move Right </h5>
                        <h5 className="text-color-b"><kbd>Direction</kbd> - Mouse Move </h5>
                        <Button variant="danger" size="lg" onClick={this.resetBoard}>Reset Game</Button>
                    </Col>
                    <Col lg="2">
                        <ProgressBar animated striped className="progress" variant={vari} now={this.state.power} />
                        <h3 className="text-color-power">Power</h3>
                    </Col>
                    <Col lg="8">
                        <canvas ref={this.canvas} />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Game;