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
        const response: TWeek = await WeekData.apiClient.get(`${this.props.facility}/${this.props.scope}`);

        const newState: State = this.makeResponseChartCompatible(response);
        this.setState(newState);

    }


    private makeResponseChartCompatible(response: TWeek): State {
        const convertedResponse: { day: TDay, data: IHour[] }[] = WeekData.sortDays(response.data) as { day: TDay, data: IHour[] }[];

        const dataList: { day: TDay, data: number[] }[] = [];

        convertedResponse.forEach((day: { day: TDay, data: IHour[] }) => {
            const dayObject: { day: TDay, data: number[] } = {
                day: day.day,
                data: []
            };

            for (let i = this.startHour - 1; i < this.endHour - 1; ++i) {
                const hourObject: IHour = day.data[i];
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

    private createLabel(length: number): string[] {

        const labelList: string[] = [];

        for (let i = this.startHour; i <= this.endHour; ++i) {
            labelList.push(i.toString().padStart(0) + ":00");
            labelList.push(i.toString().padStart(0) + ":30");
        }

        return labelList;
    }


    render() {

        if (!this.state)
            return <div/>;

        const labels: string[] = this.createLabel(this.state.data.length);
        const dayList: any[] = [];

        this.state.data.forEach((day: { day: TDay, data: number[] }, index) => {
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