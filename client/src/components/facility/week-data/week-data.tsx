import React from "react";
import APIClient from "../../api-client";
import {LineGraph} from "../../graphs";
import {IHour, TDay, TWeek} from "./week-data.interfaces";


interface Props {
    facility: string
    scope: "estimation" | "week" | "year"
}

interface State {
    data: { day: TDay, data: number[] }[]
    maxPersonCount: number
}

export default class WeekData extends React.Component {

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
        const response: TWeek = await WeekData.apiClient.get(`${this.props.facility}/${this.props.scope}`);

        const newState: State = WeekData.makeResponseChartCompatible(response);
        console.log(newState);
        this.setState(newState);

    }

    private static makeResponseChartCompatible(response: TWeek): State {
        const convertedResponse: { day: TDay, data: IHour[] }[] = WeekData.sortDays(response.data) as { day: TDay, data: IHour[] }[];

        const dataList: { day: TDay, data: number[] }[] = [];
        convertedResponse.forEach((day: { day: TDay, data: IHour[] }) => {
            const dayObject: { day: TDay, data: number[] } = {
                day: day.day, data: []
            };
            for (let hourObject of day.data) {
                dayObject.data.push(hourObject.firstHalf.value);
                dayObject.data.push(hourObject.secondHalf.value);
            }
            dataList.push(dayObject);
        });

        return {
            data: dataList,
            maxPersonCount: response.maxPersonCount
        };

    }

    private static sortDays(dayList: Record<TDay, IHour[]>): { day: TDay, data: any }[] {
        const sorter: Record<TDay, number> = {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
            "Sunday": 7
        };

        const orderedData: { day: TDay, data: any }[] = new Array(7);
        let day: TDay;
        for (day in dayList) {
            if (!dayList.hasOwnProperty(day)) continue;

            const index = sorter[day];

            // @ts-ignore
            orderedData[index] = {};
            orderedData[index].day = day;
            orderedData[index].data = dayList[day];
        }

        return orderedData;
    }


    render() {

        if (!this.state)
            return <div/>;

        const labels = [""];

        const dayList = [];
        let day: { day: TDay, data: number[] };
        for (day of this.state.data) {
            dayList.push(
                <div className="full-width">
                    <LineGraph labels={labels} maxPersonCount={this.state.maxPersonCount} data={day}/>
                </div>
            );
        }

        return <div className="full-width">
            {dayList}
        </div>;
    }

}