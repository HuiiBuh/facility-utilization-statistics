import React from "react";
import {NavLink} from "react-router-dom";
import climbingImage from "../../images/climbing.svg";

import "./sidenav.scss";

interface State {
    hidden: boolean
}

export default class Sidenav extends React.Component {

    state: State = {
        hidden: true
    };

    /**
     * Hide the sidenav
     */
    private hideSidenav = () => {
        this.setState({hidden: true});
    };

    /**
     * Show the sidenav
     * @param event The click or keyboard event
     */
    private showSidenav = (event: React.KeyboardEvent<HTMLSpanElement> | React.MouseEvent<HTMLSpanElement>) => {
        // @ts-ignore
        if (event.key !== undefined && event.key !== "Enter") return;

        this.setState({hidden: false});
    };

    render() {
        let navClassList: string = "nav-wrapper ";
        if (!this.state.hidden) navClassList += "show-menu";

        return <div className={navClassList}>
            <span className="material-icons navbar-icon" onClick={this.showSidenav} onKeyPress={this.showSidenav}
                  tabIndex={0}>menu</span>

            <div onClick={this.hideSidenav} className="nav-overlay"/>

            <div className="left">

                <div className="sidenav app-background">
                    <img className="nav-image" src={climbingImage} alt="Climbing"/>

                    <hr className="divider"/>

                    <NavLink to="/facility/bloeckle/" exact={false} className="menu-entry"
                             activeClassName="nav-active">
                        <h2>Blöckle</h2>
                    </NavLink>

                    <NavLink to="/facility/kletterbox/" exact={false} className="menu-entry"
                             activeClassName="nav-active">
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
                </div>
            </div>
        </div>;
    }
}