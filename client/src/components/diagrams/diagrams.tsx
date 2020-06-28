import React from "react";
import {Graph, RoundButton, Utilization} from "../index";

import "./diagrams.scss";

export default class Diagrams extends React.Component {

    render() {
        return (
            <div>

                <div className="header">
                    <h1>Blöckle</h1>
                </div>

                <div className="text-center">
                    <div className="select-time">
                        <RoundButton isSmall={true} isActive={true}>Aktuell</RoundButton>
                        <RoundButton isSmall={true} type="secondary">Erwartet</RoundButton>
                        <RoundButton isSmall={true} type="secondary">Monat</RoundButton>
                        <RoundButton isSmall={true} type="secondary">Jahr</RoundButton>
                    </div>
                </div>

                <Utilization data={20} maxCount={40}/>
                <Graph/>
            </div>
        );
    }
}