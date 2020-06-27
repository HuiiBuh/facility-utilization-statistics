import React from "react";

import "./app.scss";
import {Graph, Utilization, RoundButton} from "../";


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
        return (
            <div style={{marginTop: "1rem"}}>

                <RoundButton type="primary" active={true}>Ich</RoundButton>
                <RoundButton type="secondary">liebeeeeeeeeeeeee</RoundButton>
                <RoundButton type="warn">Sarah</RoundButton>

                {/*<button onClick={this.updateCurrentUtilization}>Update current</button>*/}
                {/*<Graph/>*/}
                {/*<Utilization data={this.state.currentUtilization} maxCount={this.state.maxCount}/>*/}
            </div>
        );
    }
}

export default App;

// Year Month Estimation Today