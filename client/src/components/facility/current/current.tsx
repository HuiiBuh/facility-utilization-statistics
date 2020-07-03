import React from "react";
import APIClient from "../../api-client";
import {BarGraph, LineGraph} from "../../graphs";

interface State {
    maxPersonCount: number
    value: number
}

interface Props {
    facility: string
}

export default class Current extends React.Component {

    private static apiClient: APIClient = new APIClient("/api/facility/");

    state!: State;
    props: Props;

    constructor(props: Props) {
        super(props);
        this.props = props;
    }

    /**
     * Update the current utilization when the component gets loaded
     */
    async componentDidMount(): Promise<void> {
        await this.updateComponent();
    }

    /**
     * Update the current utilization if the facility changes
     * @param previousProps The previous props with the previous facility
     * @param __
     * @param ___
     */
    async componentDidUpdate(previousProps: Props, __: Readonly<{}>, ___?: any) {
        if (this.props.facility !== previousProps.facility) {
            await this.updateComponent();
        }
    }

    /**
     * Update the component with the most recent data from the server
     */
    async updateComponent(): Promise<void> {
        const response: any = await Current.apiClient.get(`${this.props.facility}/current`);
        this.setState(response);
    }

    render() {

        //TODO loading
        if (!this.state)
            return <div/>;

        return <div className="full-width">
            <BarGraph maxPersonCount={this.state.maxPersonCount} value={this.state.value}/>
            <LineGraph/>
        </div>;


    }
}
