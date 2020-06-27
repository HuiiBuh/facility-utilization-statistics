import React from "react";

import "./sidenav.scss";
import climbingImage from "../../../images/climbing.svg";


export default class Sidenav extends React.Component {

    render() {
        return <div className="left sidenav">

            <img className="nav-image" src={climbingImage} alt="Climbing"/>

            <hr className="divider"/>

            <h2 className="menu-entry" tabIndex={0}>Blöckle</h2>
            <h2 className="menu-entry" tabIndex={0}>Kletterbox</h2>
            <div className="bottom">
                <h2 className="menu-entry" tabIndex={0}>Admin</h2>
                <h2 className="menu-entry" tabIndex={0}>Credits</h2>
            </div>
        </div>;
    }
}