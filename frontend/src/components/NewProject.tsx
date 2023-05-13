import React from "react";
import CreateProjectForm from "./components/CreateProjectForm";
import hand from "../assets/hand.png";
import "./NewProject.scss";

export default function NewProject() {
    return (
        <div className="newproject-wrapper">
            <div className="left">
                <img src={hand}></img>
            </div>
            <div className="right">
                <CreateProjectForm/>
            </div>
        </div>
    )
}