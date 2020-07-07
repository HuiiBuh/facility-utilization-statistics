import deepEqual from "deep-equal";
import React from "react";
import {NavLink, Route, Switch} from "react-router-dom";

import {RoundButton} from "../index";
import Current from "./current/current";

import "./facility.scss";

import LineGraphLoader from "./line-graph-loader/line-graph-loader";

type TStateString = "current" | "estimation" | "month" | "year" | "week"

interface Props {
    facility: string
}

interface State {
    current: boolean
    week: boolean
    estimation: boolean
    month: boolean
    year: boolean
}

export default class Facility extends React.Component {

    props: Props;

    state: State = {
        current: true,
        week: false,
        estimation: false,
        month: false,
        year: false,
    };

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    /**
     * Update the button when the component gets created
     */
    componentDidMount(): void {
        const path = window.location.pathname.split("/").pop() as TStateString;

        if (path in this.state) {
            this.updateActiveButton(path)();
        } else {
            this.updateActiveButton("current")();
        }
    }

    /**
     * Check if the current view has changed
     * @param prevProps The previous props
     * @param _
     * @param __
     */
    componentDidUpdate(prevProps: Readonly<{}>, _: Readonly<{}>, __?: any) {
        if (deepEqual(prevProps, this.props)) return;
        this.componentDidMount();
    }


    /**
     * Update the active button
     * @param key The currently active button
     */
    updateActiveButton = (key: TStateString) => {
        return (): void => {
            const stateUpdate: State = {
                current: false,
                week: false,
                estimation: false,
                month: false,
                year: false
            };
            stateUpdate[key] = true;
            this.setState(stateUpdate);
        };
    };

    /**
     * Handle enter press on the buttons
     * @param key
     */
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

                        <NavLink to={`/facility/${this.props.facility}`} exact tabIndex={-1}
                                 onClick={this.updateActiveButton("current")}
                                 onKeyPress={this.onEnter("current")}>
                            <RoundButton isSmall={true}
                                         type={this.state.current ? "primary" : "secondary"}
                                         isActive={this.state.current}>Aktuell</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/week`} tabIndex={-1}
                                 onClick={this.updateActiveButton("week")}
                                 onKeyPress={this.onEnter("week")}>
                            <RoundButton isSmall={true}
                                         type={this.state.week ? "primary" : "secondary"}
                                         isActive={this.state.week}>Woche</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/estimation`} tabIndex={-1}
                                 onClick={this.updateActiveButton("estimation")}
                                 onKeyPress={this.onEnter("estimation")}>
                            <RoundButton isSmall={true}
                                         type={this.state.estimation ? "primary" : "secondary"}
                                         isActive={this.state.estimation}>Erwartet</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/month`} tabIndex={-1}
                                 onClick={this.updateActiveButton("month")}
                                 onKeyPress={this.onEnter("month")}>
                            <RoundButton isSmall={true}
                                         type={this.state.month ? "primary" : "secondary"}
                                         isActive={this.state.month}>Monat</RoundButton>
                        </NavLink>

                        <NavLink to={`/facility/${this.props.facility}/year`} tabIndex={-1}
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

                        <Route path={`/facility/${this.props.facility}/`} exact>
                            <Current facility={this.props.facility}/>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/week`} exact>
                            <LineGraphLoader facility={this.props.facility} scope="week"/>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/estimation`} exact>
                            <LineGraphLoader facility={this.props.facility} scope="estimation"/>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/month`} exact>
                            <h1 className="text-center">Coming soon</h1>
                        </Route>
                        <Route path={`/facility/${this.props.facility}/year`} exact>
                            <h1 className="text-center">Coming soon</h1>
                        </Route>

                    </Switch>

                </div>

            </div>
        );
    }
}