class UserObject {

    constructor(name, age, coincolor, turn, score = 0) {
        this.name = name;
        this.age = age;
        this.score = score;
        this.coinColor = coincolor;
        this.isTurn = turn;
    }

}

export default UserObject;