import GameObject from "./GameObject";

class StrikerCoin extends GameObject {
    constructor(context, x, y, radius, color, mass, angle = 0, vx = 0, vy = 0) {
        super(context, x, y, vx, vy, mass);

        this.color = color;
        this.radius = radius;
        this.angle = angle;
    }

    draw = () => {
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.rotate(this.angle);
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.stroke();

        if (this.y === 225 || this.y === -225) {
            for (let index = this.radius; index < 200; index += 25) {
                this.context.beginPath();
                this.context.fillStyle = "red";
                this.context.arc(index, 0, 5, 0, 2 * Math.PI, false);
                this.context.fill();
            }
        }
        this.context.closePath();
        this.context.restore();

    }

    update = (mx, my) => {
        //Move with set velocity
        this.x += this.vx;
        this.y += this.vy;
        this.angle = Math.atan2(my - this.y, mx - this.x);
    }
}

export default StrikerCoin;