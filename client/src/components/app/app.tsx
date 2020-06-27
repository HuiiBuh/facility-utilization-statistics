import React from "react";

import "./app.scss";
import Structure from "../structure/structure";


class App extends React.Component {

    state: { currentUtilization: number, maxCount: number } = {
        currentUtilization: 5,
        maxCount: 10
    };

    updateCurrentUtilization = () => {
        this.setState({currentUtilization: Math.random() * 50});
        this.setState({maxCount: Math.floor(Math.random() * 50 + this.state.currentUtilization)});
    };

    render() {
        return (<Structure/>);
    }
}

export default App;