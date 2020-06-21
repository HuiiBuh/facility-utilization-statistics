import React from "react";

import "./app.scss";
import {Bar, Graph} from "../";


class App extends React.Component {

    state: { currentUtilization: number[] } = {
        currentUtilization: [5]
    };

    updateCurrentUtilization = () => {
        this.setState({currentUtilization: [Math.random() * 50]});
    };

    render() {
        return (
            <div>
                <button onClick={this.updateCurrentUtilization}>Update current</button>

                <Graph/>
                <Bar data={this.state.currentUtilization}/>
            </div>
        );
    }
}

export default App;
