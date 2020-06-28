import React from "react";
import {RoundButton} from "../index";

import "./facility.scss";
import {Link, NavLink, Switch, Route} from "react-router-dom";

interface IsActive {
    isExact: boolean
    params: object
    path: string
    url: string
}

interface Props {
    id: string
}

interface State {

    current: boolean
    expected: boolean
    month: boolean
    year: boolean
}

export default class Facility extends React.Component {

    props: Props = {
        id: "null"
    };

    state: State = {
        current: false,
        expected: false,
        month: false,
        year: false
    };

    active(key: "current" | "expected" | "month" | "year"): any {

        return (params: any): boolean => {
            if (!params) return false;

            const parameters: IsActive = params;

            const regex: RegExp = new RegExp(parameters.path);
            const match: boolean = regex.test(parameters.url);

            if (this.state[key] !== match) {
                const stateUpdate: State = {
                    current: false,
                    expected: false,
                    month: false,
                    year: false
                };
                stateUpdate[key] = match;
                this.setState(stateUpdate);
            }

            return match;
        };
    }

    render() {
        return (
            <div>

                <div className="header">
                    <h1>{this.props.id.charAt(0).toUpperCase() + this.props.id.slice(1)}</h1>
                </div>

                <div className="text-center">
                    <div className="select-time">

                        <NavLink to={`/facility/${this.props.id}`} isActive={this.active("current")} exact>
                            <RoundButton isSmall={true}
                                         type={this.state.current ? "primary" : "secondary"}
                                         isActive={this.state.current}>Aktuell</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/expected`} isActive={this.active("expected")}>
                            <RoundButton isSmall={true}
                                         type={this.state.expected ? "primary" : "secondary"}
                                         isActive={this.state.expected}>Erwartet</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/month`} isActive={this.active("month")}>
                            <RoundButton isSmall={true}
                                         type={this.state.month ? "primary" : "secondary"}
                                         isActive={this.state.month}>Monat</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/year`} isActive={this.active("year")}>
                            <RoundButton isSmall={true}
                                         type={this.state.year ? "primary" : "secondary"}
                                         isActive={this.state.year}>Jahr</RoundButton>
                        </NavLink>

                    </div>
                </div>

                <div className="diagram-outlet">

                    <Switch>
                        <Route path={`/facility/${this.props.id}`} exact>
                            current
                        </Route>
                        <Route path={`/facility/${this.props.id}/expected`} exact>
                            expected
                        </Route>
                        <Route path={`/facility/${this.props.id}/month`} exact>
                            month
                        </Route>
                        <Route path={`/facility/${this.props.id}/year`} exact>
                            year
                        </Route>
                    </Switch>

                </div>

            </div>
        );
    }
}
// {/*<Utilization data={20} maxCount={40}/>*/}
// {/*<Graph/>*/}
