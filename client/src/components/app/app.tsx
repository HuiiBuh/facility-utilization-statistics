import React from "react";
import {Route, Switch} from "react-router-dom";
import {Admin, Credits, Facility} from "../index";
import Sidenav from "../sidenav/sidenav";
import {IFacility} from "./app-interfaces";

import "./app.scss";

type State = {
    entryList: { identifier: string, name: string }[];
    entryObject: Record<string, string>
}

class App extends React.Component {

    /**
     * Get the possible facilities from the backend and display them in the sidenav
     */
    public async componentDidMount(): Promise<void> {
        const response: IFacility[] = await fetch("/api/facility/all")
            .then(async (response) => await response.json());

        const entryList = [];
        const entryObject: Record<string, string> = {};
        for (const facility of response) {

            entryList.push({
                identifier: facility.identifier,
                name: facility.name
            });

            entryObject[facility.identifier] = facility.name;
        }

        this.setState({entryList: entryList, entryObject: entryObject});
    }

    render() {
        return (
            <div>

                <Switch>

                    <Route path="/embed">
                        {this.mainContent("/embed")}
                    </Route>

                    <Route path="/">
                        <div className="fullscreen flex">

                            <Sidenav entries={this.state.entryList}/>

                            <div className="right">
                                {this.mainContent("")}
                            </div>

                        </div>
                    </Route>

                </Switch>

            </div>
        );
    }

    state: State = {
        entryList: [],
        entryObject: {}
    };

    mainContent(baseURL: string) {
        return <Switch>
            <Route path={`${baseURL}/facility/:facility`} render={({match}) => (
                <Facility
                    baseURL={baseURL}
                    identifier={match.params.facility}
                    nameObject={this.state.entryObject}
                />)}>
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