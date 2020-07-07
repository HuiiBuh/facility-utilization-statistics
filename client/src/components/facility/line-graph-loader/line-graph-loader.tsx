import deepEqual from "deep-equal";
import React from "react";
import APIClient from "../../api-client";
import {LineGraph} from "../../graphs";
import {createLabel} from "../functions";
import {IWeek, IWeekOverview} from "./line-graph-loader.interfaces";


interface Props {
    facility: string
    scope: "estimation" | "week" | "year"
}

type State = { data: IWeek | IWeekOverview, scope: string };

/**
 * A class which loads data into line graphs
 */
export default class LineGraphLoader extends React.Component {

    private static apiClient: APIClient = new APIClient("/api/facility/");

    props: Props;
    state!: State;

    constructor(props: Props) {
        super(props);
        this.props = props;
    }

    /**
     * Load the component data
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
        if (deepEqual(previousProps, this.props)) return;
        await this.updateComponent();
    }

    /**
     * Make a api call to fetch the data and update the state
     */
    async updateComponent(): Promise<void> {
        const response: any = await LineGraphLoader.apiClient.get(`${this.props.facility}/${this.props.scope}`);
        this.setState({data: response, scope: this.props.scope});
    }


    render() {
        // Placeholder in case the state is not loaded
        if (!this.state || this.props.scope !== this.state.scope)
            return <div/>;

        if (this.props.scope === "week") return this.renderDayOverview();
        else if (this.props.scope === "estimation") return this.renderMultipleDays();
    }

    /**
     * Render the week overview
     */
    renderDayOverview() {
        const state: IWeekOverview = this.state.data as IWeekOverview;

        const valueList: number[] = [];
        const labelList: string[] = [];

        state.data.forEach(hour => {
            valueList.push(hour.value);
            labelList.push(hour.day);
        });

        return <div className="full-width">
            <LineGraph data={valueList} maxPersonCount={state.maxPersonCount} labels={labelList}/>
        </div>;
    }

    /**
     * Render multiple days as multiple diagrams below each other
     */
    renderMultipleDays() {
        const state: IWeek = this.state.data as IWeek;

        const dayList: any[] = [];
        state.data.forEach((day, index) => {

            let labels: string[] = [];
            try {
                labels = createLabel(day.data.length, day.open, day.close);
            } catch (e) {
                return;
            }

            dayList.push(
                <div className="full-width" key={index}>
                    <h2 className="line-graph-heading text-center">{day.day}</h2>
                    <LineGraph data={day.data} maxPersonCount={this.state.data.maxPersonCount} labels={labels}/>
                </div>
            );
        });

        return <div className="full-width">
            {dayList}
        </div>;
    }
}