import React from "react";
import {Route, Switch} from "react-router-dom";
import {Admin, Credits, Facility} from "../index";
import Sidenav from "../sidenav/sidenav";

import "./app.scss";


class App extends React.Component {
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