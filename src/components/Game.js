import React, { Component } from "react";
import "./Game.css"


class Game extends Component {

    state = {
        bird: {
            radius: 20
        }
    }

    draw = (ctx, x, y, colour) => {
        // change this colour to change the colour of your 
        // "pen" in the canvas 
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.arc(x, y, this.state.bird.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    componentDidMount() {
        const ctx = this.refs.canvas.getContext("2d");
        this.refs.canvas.width = window.innerWidth;
        this.refs.canvas.height = window.innerHeight;
        this.draw(ctx, 50, 100, "red");
        this.draw(ctx, 50, 160, "black");
    }

    render() {
        return (
            <div>
                <canvas ref="canvas" />
            </div>
        );
    }
}

export default Game;