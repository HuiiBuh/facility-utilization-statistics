import React from "react";
import {Route, Switch} from "react-router-dom";

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

                    <Switch>
                        <Route path="/facility/:facility" render={({match}) => (
                            <Facility facility={match.params.facility}/>)}>
                        </Route>
                        <Route exact path="/credits">
                            <Credits/>
                        </Route>
                        <Route exact path="/admin">
                            <Admin/>
                        </Route>
                        <Route path="/" exact>
                            <h1 className="text-center">Wähle eine Einrichtung</h1>
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