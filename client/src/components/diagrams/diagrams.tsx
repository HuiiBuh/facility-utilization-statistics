import React from "react";
import {Graph, Utilization} from "../index";

import "./diagrams.scss";

export default class Diagrams extends React.Component {

    render() {
        return (
            <div>
                <Utilization data={20} maxCount={40}/>
                <Graph/>
            </div>
        );
    }
}