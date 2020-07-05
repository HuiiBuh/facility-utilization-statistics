import React from "react";
import APIClient from "../../api-client";
import {LineGraph} from "../../graphs";
import {ChartWeek} from "./week-data.interfaces";


interface Props {
    facility: string
    scope: "estimation" | "week" | "year"
}

interface State extends ChartWeek {
}

export default class WeekData extends React.Component {

    private static apiClient: APIClient = new APIClient("/api/facility/");

    startHour: number = 10;
    endHour: number = 22;

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
        const response: any = await WeekData.apiClient.get(`${this.props.facility}/${this.props.scope}`);
        this.setState(response);
    }


    private static createLabel(length: number, openHour: number, closeHour: number): string[] {
        const labelList: string[] = [];

        for (let i = openHour; i <= closeHour; ++i) {
            labelList.push(i.toString().padStart(0) + ":00");
            labelList.push(i.toString().padStart(0) + ":30");
        }

        return labelList;
    }


    render() {

        if (!this.state)
            return <div/>;

        const dayList: any[] = [];

        this.state.data.forEach((day, index) => {
            const labels: string[] = WeekData.createLabel(day.data.length, day.open, day.close);

            dayList.push(
                <div className="full-width" key={index}>
                    <LineGraph labels={labels} maxPersonCount={this.state.maxPersonCount} data={day}/>
                </div>
            );
        });

        return <div className="full-width">
            {dayList}
        </div>;
    }


}