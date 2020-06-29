import React from "react";
import {RoundButton} from "../index";

import "./facility.scss";
import {NavLink, Route, Switch} from "react-router-dom";
import {BarGraph} from "../graphs";

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

    props: Props;

    state: State = {
        current: true,
        expected: false,
        month: false,
        year: false
    };

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    updateActiveButton = (key: "current" | "expected" | "month" | "year") => {
        return (): void => {
            const stateUpdate: State = {
                current: false,
                expected: false,
                month: false,
                year: false
            };
            stateUpdate[key] = true;
            this.setState(stateUpdate);
        };
    };

    onEnter = (key: "current" | "expected" | "month" | "year"): (event: React.KeyboardEvent<HTMLAnchorElement>) => void => {
        return (event: React.KeyboardEvent<HTMLAnchorElement>): void => {
            event.key === "Enter" && this.updateActiveButton(key)();
        };
    };


    render() {
        return (
            <div className="full-height">

                <div className="header">
                    <h1>{this.props.id.charAt(0).toUpperCase() + this.props.id.slice(1)}</h1>
                </div>

                <div className="text-center">
                    <div className="select-time">

                        <NavLink to={`/facility/${this.props.id}`} exact tabIndex={-1}
                                 onClick={this.updateActiveButton("current")}
                                 onKeyPress={this.onEnter("current")}
                        >
                            <RoundButton isSmall={true}
                                         type={this.state.current ? "primary" : "secondary"}
                                         isActive={this.state.current}>Aktuell</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/expected`} tabIndex={-1}
                                 onClick={this.updateActiveButton("expected")}
                                 onKeyPress={this.onEnter("expected")}
                        >
                            <RoundButton isSmall={true}
                                         type={this.state.expected ? "primary" : "secondary"}
                                         isActive={this.state.expected}>Erwartet</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/month`} tabIndex={-1}
                                 onClick={this.updateActiveButton("month")}
                                 onKeyPress={this.onEnter("month")}>
                            <RoundButton isSmall={true}
                                         type={this.state.month ? "primary" : "secondary"}
                                         isActive={this.state.month}>Monat</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/year`} tabIndex={-1}
                                 onClick={this.updateActiveButton("year")}
                                 onKeyPress={this.onEnter("year")}>
                            <RoundButton isSmall={true}
                                         type={this.state.year ? "primary" : "secondary"}
                                         isActive={this.state.year}>Jahr</RoundButton>
                        </NavLink>

                    </div>
                </div>

                <div className="diagram-outlet">

                    <Switch>
                        <Route path={`/facility/${this.props.id}`} exact>
                            <BarGraph data={20} maxCount={40}/>
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