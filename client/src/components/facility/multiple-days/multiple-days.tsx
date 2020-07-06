import React from "react";
import APIClient from "../../api-client";
import {LineGraph} from "../../graphs";
import {ChartWeek} from "./multiple-days.interfaces";
import {createLabel} from "../functions";


interface Props {
    facility: string
    scope: "estimation" | "week" | "year"
}

interface State extends ChartWeek {
}

export default class MultipleDays extends React.Component {

    private static apiClient: APIClient = new APIClient("/api/facility/");

    props!: Props;
    state!: State;

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
        if (this.props.facility !== previousProps.facility || this.props.scope !== previousProps.scope) {
            await this.updateComponent();
        }
    }

    async updateComponent(): Promise<void> {
        const response: any = await MultipleDays.apiClient.get(`${this.props.facility}/${this.props.scope}`);
        this.setState(response);
    }


    render() {

        if (!this.state)
            return <div/>;

        const dayList: any[] = [];

        this.state.data.forEach((day, index) => {
            const labels: string[] = createLabel(day.data.length, day.open, day.close);

            dayList.push(
                <div className="full-width" key={index}>
                    <LineGraph data={day} maxPersonCount={this.state.maxPersonCount} labels={labels}/>
                </div>
            );
        });

        return <div className="full-width">
            {dayList}
        </div>;
    }


}