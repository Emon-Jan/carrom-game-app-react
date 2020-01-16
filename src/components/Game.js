import React, { Component } from "react";
import CarromCoin from "../models/CarromCoin";
import BoardImage from "../carrom.png"
import "./Game.css"
import StrikerCoin from "../models/StrikerCoin";

let ctx;
let canvasRef;
let requestId;
let gameObjects = [];
let striker;
let keys = [];
let count = 0;

let friction = 0.5;
let image;
let hole = [];
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
            { pX: 0, pY: (-this.props.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: 0, pY: ((this.props.circle.radius * 2) + 32), pCol: "DARKSLATEGRAY" },
            { pX: 0, pY: (-(this.props.circle.radius * 2) - 32), pCol: "DARKSLATEGRAY" },
            { pX: 27, pY: this.props.circle.radius, pCol: "DARKSLATEGRAY" },
            { pX: 27, pY: -this.props.circle.radius, pCol: "WHEAT" },
            { pX: 27, pY: ((this.props.circle.radius * 2) + 16), pCol: "WHEAT" },
            { pX: 27, pY: (-(this.props.circle.radius * 2) - 16), pCol: "WHEAT" },
            { pX: -27, pY: this.props.circle.radius, pCol: "DARKSLATEGRAY" },
            { pX: -27, pY: -this.props.circle.radius, pCol: "WHEAT" },
            { pX: -27, pY: ((this.props.circle.radius * 2) + 16), pCol: "WHEAT" },
            { pX: -27, pY: (-(this.props.circle.radius * 2) - 16), pCol: "WHEAT" },
            { pX: 54, pY: 0, pCol: "WHEAT" },
            { pX: 54, pY: (this.props.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: 54, pY: (-this.props.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: -54, pY: 0, pCol: "WHEAT" },
            { pX: -54, pY: (this.props.circle.radius * 2), pCol: "DARKSLATEGRAY" },
            { pX: -54, pY: (-this.props.circle.radius * 2), pCol: "DARKSLATEGRAY" },
        ];
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        canvasRef = this.canvas.current;

        canvasRef.addEventListener("mousemove", (event) => {
            var rect = canvasRef.getBoundingClientRect();
            this.mouse.x = event.x - rect.left - 400;
            this.mouse.y = event.y - rect.top - 400;
        });

        document.addEventListener("keydown", (event) => {
            console.log(event.keyCode, event.timeStamp, event.which);
            keys[event.keyCode] = true;
        });

        document.addEventListener("keyup", (event) => {
            console.log(event.keyCode, event.timeStamp);
            keys[event.keyCode] = false;
            // gameObjects[this.pos.length].vx = 0;
            // count = 0;
        });

        ctx = canvasRef.getContext("2d");
        image = new Image();
        image.src = BoardImage;
        image.style = "color: red";
        console.log(image);


        canvasRef.width = 800;
        canvasRef.height = 800;
        ctx.translate(400, 400);
        this.initCarromBoard();

        console.log(gameObjects);

        image.onload = () => {
            requestAnimationFrame(this.carromLoop);
        };
    }

    initCarromBoard = () => {
        for (let index = 0; index < this.pos.length; index++) {
            gameObjects[index] = new CarromCoin(ctx, this.pos[index].pX, this.pos[index].pY, this.props.circle.radius, this.pos[index].pCol, 10);
            gameObjects[index].draw();
        }
        gameObjects[this.pos.length] = new StrikerCoin(ctx, 0, 225, this.props.circle.radius + 10, "GAINSBORO", 10);
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
        if (keys[37] && (gameObjects[gameObjects.length - 1].x - this.props.circle.radius) > -200) {
            gameObjects[gameObjects.length - 1].x -= 5;
        }
        else if (keys[39] && (gameObjects[gameObjects.length - 1].x + this.props.circle.radius) < 200) {
            gameObjects[gameObjects.length - 1].x += 5;
        }

        if (keys[32]) {
            gameObjects[gameObjects.length - 1].vx += Math.cos(gameObjects[gameObjects.length - 1].angle) * 2;
            gameObjects[gameObjects.length - 1].vy += Math.sin(gameObjects[gameObjects.length - 1].angle) * 2;
        }
        // else {
        //     if (gameObjects[gameObjects.length - 1].x !== 0 && gameObjects[gameObjects.length - 1].y !== 225) {
        //         gameObjects[gameObjects.length - 1].x = 0;
        //         gameObjects[gameObjects.length - 1].y = 225;
        //     }
        // }
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
                    // this.resolveCollision(obj1, obj2);
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

    rotate = (obj, angle) => {
        const rotatedVelocities = {
            x: obj.vx * Math.cos(angle) - obj.vy * Math.sin(angle),
            y: obj.vx * Math.sin(angle) + obj.vy * Math.cos(angle)
        };
        return rotatedVelocities;
    }


    resolveCollision = (particle, otherParticle) => {
        const xVelocityDiff = particle.vx - otherParticle.vx;
        const yVelocityDiff = particle.vy - otherParticle.vy;

        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            // Grab angle between the two colliding particles
            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

            // Store mass in var for better readability in collision equation
            const m1 = particle.mass;
            const m2 = otherParticle.mass;

            // Velocity before equation
            const u1 = this.rotate(particle, angle);
            const u2 = this.rotate(otherParticle, angle);

            // Velocity after 1d collision equation
            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

            // Final velocity after rotating axis back to original location
            const vFinal1 = this.rotate(v1, -angle);
            const vFinal2 = this.rotate(v2, -angle);

            // Swap particle velocities for realistic bounce effect
            particle.vx = vFinal1.x;
            particle.vy = vFinal1.y;

            otherParticle.vx = vFinal2.x;
            otherParticle.vy = vFinal2.y;
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
                        }
                    }
                    if (xPoxyNeg) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                        }
                    }
                    if (xNegyPos) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                        }
                    }
                    if (xPosyPos) {
                        if (gameObjects[i].radius !== 26) {
                            gameObjects.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    // detectCollisionWithStriker = (strkr) => {
    //     let obj1;

    //     for (let i = 0; i < gameObjects.length; i++) {
    //         obj1 = gameObjects[i];

    //         if (this.circleCollide(obj1.x, obj1.y, obj1.radius, strkr.x, strkr.y, strkr.radius)) {
    //             let vCollision = { x: strkr.x - obj1.x, y: strkr.y - obj1.y };
    //             let distance = Math.sqrt((strkr.x - obj1.x) * (strkr.x - obj1.x) + (strkr.y - obj1.y) * (strkr.y - obj1.y));
    //             let vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
    //             let vRelativeVelocity = { x: obj1.vx - strkr.vx, y: obj1.vy - strkr.vy };
    //             let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    //             if (speed < 0) { break; }

    //             let impulse = 2 * speed / (obj1.mass + strkr.mass);
    //             obj1.vx -= (impulse * strkr.mass * vCollisionNorm.x);
    //             obj1.vy -= (impulse * strkr.mass * vCollisionNorm.y);
    //             strkr.vx += (impulse * obj1.mass * vCollisionNorm.x);
    //             strkr.vy += (impulse * obj1.mass * vCollisionNorm.y);

    //         }

    //     }
    // }

    carromLoop = () => {
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
        requestId = requestAnimationFrame(this.carromLoop);
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