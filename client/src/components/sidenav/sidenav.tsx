import React from "react";
import {NavLink} from "react-router-dom";

import "./sidenav.scss";
import climbingImage from "../../images/climbing.svg";


export default class Sidenav extends React.Component {

    render() {
        return <div className="left sidenav">

            <img className="nav-image" src={climbingImage} alt="Climbing"/>

            <hr className="divider"/>

            <NavLink to="/facility/blöckle" className="menu-entry" activeClassName="nav-active">
                <h2>Blöckle</h2>
            </NavLink>
            <NavLink to="/facility/kletterbox" className="menu-entry" activeClassName="nav-active">
                <h2>Kletterbox</h2>
            </NavLink>

            <div className="bottom">
                {localStorage.getItem("isAdmin") &&
                <NavLink to="/admin" className="menu-entry" activeClassName="nav-active">
                    <h2>Admin</h2>
                </NavLink>
                }
                <NavLink to="/credits" className="menu-entry" activeClassName="nav-active">
                    <h2>Credits</h2>
                </NavLink>
            </div>
        </div>;
    }
}