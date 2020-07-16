import React from "react";
import {Route, Switch} from "react-router-dom";
import {Admin, Credits, Facility} from "../index";
import Sidenav from "../sidenav/sidenav";

import "./app.scss";

class App extends React.Component {
    render() {

        return (
            <div>

                <Switch>

                    <Route path="/embed">
                        {this.mainContent("/embed")}
                    </Route>

                    <Route path="/">
                        <div className="fullscreen flex">

                            <Sidenav/>

                            <div className="right">
                                {this.mainContent("")}
                            </div>

                        </div>
                    </Route>

                </Switch>


            </div>
        );
    }

    mainContent(baseURL: string) {
        return <Switch>
            <Route path={`${baseURL}/facility/:facility`} render={({match}) => (
                <Facility baseURL={baseURL} facility={match.params.facility}/>)}>
            </Route>
            <Route exact path={`${baseURL}/credits`}>
                <Credits/>
            </Route>
            <Route exact path={`${baseURL}/admin`}>
                <Admin/>
            </Route>
            <Route path={`/`} exact>
                <h1 className="text-center">Wähle eine Einrichtung</h1>
            </Route>
            <Route path="/">
                <h1 className="text-center">Nothing found</h1>
            </Route>
        </Switch>;
    }
}

export default App;