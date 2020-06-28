import React from "react";
import {Switch, Route} from "react-router-dom";

import "./app.scss";
import Sidenav from "../sidenav/sidenav";
import {Admin, Credits, Facility} from "../index";


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
            <div className="fullscreen flex">

                <Sidenav/>

                <div className="right">
                    {/*<span className="close">&#43;</span>*/}

                    <Switch>
                        <Route path="/facility/:id" render={({match}) => (
                            <Facility id={match.params.id}/>)}>
                        </Route>
                        <Route exact path="/credits">
                            <Credits/>
                        </Route>
                        <Route exact path="/admin">
                            <Admin/>
                        </Route>
                        <Route path="/">
                            <h1 className="text-center">Nothing found</h1>
                        </Route>
                    </Switch>

                </div>

            </div>
        );
    }
}

export default App;