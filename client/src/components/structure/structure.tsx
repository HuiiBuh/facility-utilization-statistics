import React from "react";

import "./structure.scss";
import Sidenav from "./sidenav/sidenav";
import {Diagrams, RoundButton} from "../index";

export default class Structure extends React.Component {
    render() {
        return <div className="fullscreen">

            <div className="flex">

                <Sidenav/>

                <div className="right">

                    {/*<span className="close">&#43;</span>*/}

                    <div className="header">
                        <h1>Blöckle</h1>
                    </div>

                    <div className="body">

                        <div className="text-center">
                            <div className="select-time">
                                <RoundButton isSmall={true} isActive={true}>Aktuell</RoundButton>
                                <RoundButton isSmall={true} type="secondary">Erwartet</RoundButton>
                                <RoundButton isSmall={true} type="secondary">Monat</RoundButton>
                                <RoundButton isSmall={true} type="secondary">Jahr</RoundButton>
                            </div>
                        </div>

                        <Diagrams/>

                    </div>
                </div>
            </div>

        </div>;
    }
}


