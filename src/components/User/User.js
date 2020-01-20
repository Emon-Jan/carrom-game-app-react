import React from "react";
import "./User.css"

const user = (props) => {
    return (
        <React.Fragment >
            <h4 className={props.turn ? "text-color-user-turn" : "text-color-user"}>Name: {props.name}</h4>
            <h4 className={props.turn ? "text-color-user-turn" : "text-color-user"}>Score: {props.score}</h4>
        </React.Fragment>
    );
};

export default user;