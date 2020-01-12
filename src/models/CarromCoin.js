import GameObject from "./GameObject";

class CarromCoin extends GameObject {
    constructor(context, x, y, radius, color, vx = 0, vy = 0) {
        super(context, x, y, vx, vy);

        this.color = color;
        this.radius = radius;
    }

    draw = () => {
        this.context.fillStyle = this.color;
        // this.context.strokeStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();
    }

    update = (secondsPassed) => {
        //Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;
    }
}

export default CarromCoin;