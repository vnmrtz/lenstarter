//make a react component a box that can be provided by props three values and are able to be rendered
import React from "react";
import "./Box.scss";

export default function Box(props: any) {
    return (
        <div className="box-wrapper">
            <div className="text-middle space">
                {props.middle}
            </div>
            <div className="text-bottom space">
                {props.bottom}
            </div>
        </div>
    )
}
