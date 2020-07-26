import deepEqual from "deep-equal";
import React from "react";
import {NavLink, Route, Switch} from "react-router-dom";

import {RoundButton} from "../index";
import Current from "./current/current";

import "./facility.scss";

import LineGraphLoader from "./line-graph-loader/line-graph-loader";

type TStateString = "current" | "estimation" | "month" | "year" | "week"

interface Props {
    identifier: string
    baseURL: string
    nameObject: Record<string, string>
}

interface State {
    current: boolean
    week: boolean
    estimation: boolean
    month: boolean
    year: boolean

    success: boolean
    error?: Response
}

export default class Facility extends React.Component {

    props: Props;

    state: State = {
        current: true,
        week: false,
        estimation: false,
        month: false,
        year: false,
        success: true
    };

    constructor(props: Props) {
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

        this.setTitle();
    }

    /**
     * Check if the current view has changed
     * @param prevProps The previous props
     * @param _
     * @param __
     */
    componentDidUpdate(prevProps: Readonly<{}>, _: Readonly<{}>, __?: any) {
        this.setTitle();

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
                year: false,
                success: true
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

    requestError = (response: Response) => {
        this.setState({success: false, error: response});
    };


    setTitle() {
        let title = this.props.nameObject[this.props.identifier];

        if (this.state.current) title += " - Aktuell";
        if (this.state.year) title += " - Jahr";
        if (this.state.month) title += " - Monat";
        if (this.state.week) title += " - Woche";
        if (this.state.estimation) title += " - Erwartet";

        document.title = title;
    }


    render() {

        if (this.state.success) return this.renderSuccess();
        else return this.renderError();
    }

    renderSuccess() {
        return (
            <div className="full-height">

                <div className="header">
                    <h1>{this.props.nameObject[this.props.identifier]}</h1>
                </div>

                {this.getNavigationButtons()}

                <div className="diagram-outlet">

                    <Switch>

                        <Route path={`${this.props.baseURL}/facility/${this.props.identifier}/`} exact>
                            <Current facility={this.props.identifier} notFoundCallback={this.requestError}/>
                        </Route>
                        <Route path={`${this.props.baseURL}/facility/${this.props.identifier}/week`} exact>
                            <LineGraphLoader facility={this.props.identifier} scope="week"
                                             notFoundCallback={this.requestError}/>
                        </Route>
                        <Route path={`${this.props.baseURL}/facility/${this.props.identifier}/estimation`} exact>
                            <LineGraphLoader facility={this.props.identifier} scope="estimation"
                                             notFoundCallback={this.requestError}/>
                        </Route>
                        <Route path={`${this.props.baseURL}/facility/${this.props.identifier}/month`} exact>
                            <h1 className="text-center">Coming soon</h1>
                        </Route>
                        <Route path={`${this.props.baseURL}/facility/${this.props.identifier}/year`} exact>
                            <h1 className="text-center">Coming soon</h1>
                        </Route>

                    </Switch>

                </div>

            </div>
        );
    }

    getNavigationButtons() {

        return (
            <div className="text-center">
                <div className="select-time">
                    <NavLink to={`${this.props.baseURL}/facility/${this.props.identifier}`} exact tabIndex={-1}
                             onClick={this.updateActiveButton("current")}
                             onKeyPress={this.onEnter("current")}>
                        <RoundButton isSmall={true}
                                     type={this.state.current ? "primary" : "secondary"}
                                     isActive={this.state.current}>Aktuell</RoundButton>
                    </NavLink>

                    <NavLink to={`${this.props.baseURL}/facility/${this.props.identifier}/week`} tabIndex={-1}
                             onClick={this.updateActiveButton("week")}
                             onKeyPress={this.onEnter("week")}>
                        <RoundButton isSmall={true}
                                     type={this.state.week ? "primary" : "secondary"}
                                     isActive={this.state.week}>Woche</RoundButton>
                    </NavLink>

                    <NavLink to={`${this.props.baseURL}/facility/${this.props.identifier}/estimation`} tabIndex={-1}
                             onClick={this.updateActiveButton("estimation")}
                             onKeyPress={this.onEnter("estimation")}>
                        <RoundButton isSmall={true}
                                     type={this.state.estimation ? "primary" : "secondary"}
                                     isActive={this.state.estimation}>Erwartet</RoundButton>
                    </NavLink>

                    <NavLink to={`${this.props.baseURL}/facility/${this.props.identifier}/month`} tabIndex={-1}
                             onClick={this.updateActiveButton("month")}
                             onKeyPress={this.onEnter("month")}>
                        <RoundButton isSmall={true}
                                     type={this.state.month ? "primary" : "secondary"}
                                     isActive={this.state.month}>Monat</RoundButton>
                    </NavLink>

                    <NavLink to={`${this.props.baseURL}/facility/${this.props.identifier}/year`} tabIndex={-1}
                             onClick={this.updateActiveButton("year")}
                             onKeyPress={this.onEnter("year")}>
                        <RoundButton isSmall={true}
                                     type={this.state.year ? "primary" : "secondary"}
                                     isActive={this.state.year}>Jahr</RoundButton>
                    </NavLink>
                </div>
            </div>
        );
    }

    renderError() {
        const statusCode = this.state.error?.status ? this.state.error.status : 0;
        if (statusCode === 404) {
            return <h1 className="text-center">Facility does not exist</h1>;
        } else if (statusCode >= 500) {
            return <h1 className="text-center">Internal server error</h1>;
        } else if (statusCode < 500 && statusCode >= 400) {
            return <h1 className="text-center">Client error</h1>;
        } else {
            return <h1 className="text-center">Unknown error</h1>;
        }
    }
}