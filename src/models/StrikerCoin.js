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


        this.context.fillStyle = "red";
        this.context.fillRect(0, -5, 60, 10);
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