import React from "react";
import {RoundButton} from "../index";

import "./facility.scss";
import {NavLink, Route, Switch} from "react-router-dom";
import {BarGraph, LineGraph} from "../graphs";

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
    today: boolean
    month: boolean
    year: boolean
}

export default class Facility extends React.Component {

    props: Props;

    state: State = {
        current: true,
        today: false,
        expected: false,
        month: false,
        year: false
    };

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    componentDidMount(): void {
        const path = window.location.pathname.split("/").pop() as "current" | "expected" | "month" | "year" | "today";

        if (path in this.state) {
            this.updateActiveButton(path)();
        }
    }


    updateActiveButton = (key: "current" | "expected" | "month" | "year" | "today") => {
        return (): void => {
            const stateUpdate: State = {
                current: false,
                today: false,
                expected: false,
                month: false,
                year: false
            };
            stateUpdate[key] = true;
            this.setState(stateUpdate);
        };
    };

    onEnter = (key: "current" | "expected" | "month" | "year" | "today"): (event: React.KeyboardEvent<HTMLAnchorElement>) => void => {
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

                        <NavLink to={`/facility/${this.props.id}/current`} exact tabIndex={-1}
                                 onClick={this.updateActiveButton("current")}
                                 onKeyPress={this.onEnter("current")}>
                            <RoundButton isSmall={true}
                                         type={this.state.current ? "primary" : "secondary"}
                                         isActive={this.state.current}>Aktuell</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/today`} exact tabIndex={-1}
                                 onClick={this.updateActiveButton("today")}
                                 onKeyPress={this.onEnter("today")}>
                            <RoundButton isSmall={true}
                                         type={this.state.today ? "primary" : "secondary"}
                                         isActive={this.state.today}>Heute</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.id}/expected`} tabIndex={-1}
                                 onClick={this.updateActiveButton("expected")}
                                 onKeyPress={this.onEnter("expected")}>
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
                            <RoundButton isSmall={true} class="no-margin-right"
                                         type={this.state.year ? "primary" : "secondary"}
                                         isActive={this.state.year}>Jahr</RoundButton>
                        </NavLink>

                    </div>
                </div>

                <div className="diagram-outlet">

                    <Switch>
                        <Route path={`/facility/${this.props.id}/current`} exact>
                            <BarGraph data={10} maxCount={50}/>
                        </Route>
                        <Route path={`/facility/${this.props.id}/today`} exact>
                            <LineGraph/>
                        </Route>
                        <Route path={`/facility/${this.props.id}/expected`} exact>
                            <LineGraph/>
                        </Route>
                        <Route path={`/facility/${this.props.id}/month`} exact>
                            <LineGraph/>
                        </Route>
                        <Route path={`/facility/${this.props.id}/year`} exact>
                            <LineGraph/>
                        </Route>
                    </Switch>

                </div>

            </div>
        );
    }
}