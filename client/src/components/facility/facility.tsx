import React from "react";
import Today from "./today/today";
import {RoundButton} from "../index";

import "./facility.scss";
import {NavLink, Route, Switch} from "react-router-dom";
import {BarGraph, LineGraph} from "../graphs";

type TStateString = "current" | "expected" | "month" | "year" | "today" | "week"

interface IsActive {
    isExact: boolean
    params: object
    path: string
    url: string
}

interface Props {
    facility: string
}

interface State {

    current: boolean
    week: boolean
    expected: boolean
    today: boolean
    month: boolean
    year: boolean
}

export default class Facility extends React.Component {

    props: Props;

    state: State = {
        current: true,
        week: false,
        today: false,
        expected: false,
        month: false,
        year: false,
    };

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    componentDidMount(): void {
        const path = window.location.pathname.split("/").pop() as TStateString;

        if (path in this.state) {
            this.updateActiveButton(path)();
        }
    }


    updateActiveButton = (key: TStateString) => {
        return (): void => {
            const stateUpdate: State = {
                current: false,
                today: false,
                week: false,
                expected: false,
                month: false,
                year: false
            };
            stateUpdate[key] = true;
            this.setState(stateUpdate);
        };
    };

    onEnter = (key: TStateString): (event: React.KeyboardEvent<HTMLAnchorElement>) => void => {
        return (event: React.KeyboardEvent<HTMLAnchorElement>): void => {
            event.key === "Enter" && this.updateActiveButton(key)();
        };
    };


    render() {
        return (
            <div className="full-height">

                <div className="header">
                    <h1>{this.props.facility.charAt(0).toUpperCase() + this.props.facility.slice(1)}</h1>
                </div>

                <div className="text-center">
                    <div className="select-time">

                        <NavLink to={`/facility/${this.props.facility}/current`} exact tabIndex={-1}
                                 onClick={this.updateActiveButton("current")}
                                 onKeyPress={this.onEnter("current")}>
                            <RoundButton isSmall={true}
                                         type={this.state.current ? "primary" : "secondary"}
                                         isActive={this.state.current}>Aktuell</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/today`} exact tabIndex={-1}
                                 onClick={this.updateActiveButton("today")}
                                 onKeyPress={this.onEnter("today")}>
                            <RoundButton isSmall={true}
                                         type={this.state.today ? "primary" : "secondary"}
                                         isActive={this.state.today}>Heute</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/week`} tabIndex={-1}
                                 onClick={this.updateActiveButton("week")}
                                 onKeyPress={this.onEnter("week")}>
                            <RoundButton isSmall={true}
                                         type={this.state.week ? "primary" : "secondary"}
                                         isActive={this.state.week}>Woche</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/expected`} tabIndex={-1}
                                 onClick={this.updateActiveButton("expected")}
                                 onKeyPress={this.onEnter("expected")}>
                            <RoundButton isSmall={true}
                                         type={this.state.expected ? "primary" : "secondary"}
                                         isActive={this.state.expected}>Erwartet</RoundButton>
                        </NavLink>

                    </div>
                </div>

                <div className="diagram-outlet">

                    <Switch>

                        <Route path={`/facility/${this.props.facility}/current`} exact>
                            <Today facility={this.props.facility}/>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/today`} exact>
                            <LineGraph/>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/week`} exact>
                            <LineGraph/>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/expected`} exact>
                            <LineGraph/>
                        </Route>

                    </Switch>

                </div>

            </div>
        );
    }
}