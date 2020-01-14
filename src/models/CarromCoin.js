import GameObject from "./GameObject";

class CarromCoin extends GameObject {
    constructor(context, x, y, radius, color, mass, vx = 0, vy = 0) {
        super(context, x, y, vx, vy, mass);

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

    rotate = (r) => {
        this.context.rotate(r);
    }

    update = () => {
        //Move with set velocity
        this.x += this.vx;
        this.y += this.vy;
    }
}

export default CarromCoin;