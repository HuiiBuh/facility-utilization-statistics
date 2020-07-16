import React from "react";
import {BarGraph, LineGraph} from "../../graphs";
import {createLabels} from "../functions";
import {ICurrent, IWeek} from "../line-graph-loader/line-graph-loader.interfaces";


interface State {
    day: IWeek,
    current: ICurrent
}

interface Props {
    facility: string
}

export default class Current extends React.Component {

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
        const day: IWeek = await fetch(`/api/facility/${this.props.facility}/today`)
            .then(async (response) => await response.json());

        const current: ICurrent = await fetch(`/api/facility/${this.props.facility}/current`)
            .then(async (response) => await response.json());

        Current.updateColor(current);

        const newState: State = {current: current, day: day};
        this.setState(newState);
    }

    /**
     * Update the color depending on the utilization
     * @param response The api reponse
     */
    private static updateColor(response: ICurrent) {
        if (response.value < 50) {
            response.color = "rgb(99,154,26)";
            response.borderColor = "rgb(99,154,26)";
        } else if (response.value < 75) {
            response.color = "rgb(255,153,0)";
            response.borderColor = "rgb(236,134,9)";
        } else {
            response.color = "rgb(205,65,65)";
            response.borderColor = "rgb(205,65,36)";
        }
    }

    render() {
        if (!this.state)
            return <div/>;

        return this.renderCurrent();
    }

    /**
     * Render the current view
     */
    renderCurrent() {
        const day = this.state.day.data[0];
        const labels: string[] = createLabels(day.data.length, day.open, day.close);

        return <div className="full-width">
            <BarGraph maxPersonCount={this.state.current.maxPersonCount} value={this.state.current.value}
                      borderColor={this.state.current.borderColor} color={this.state.current.color}/>
            <LineGraph data={day.data} maxPersonCount={this.state.day.maxPersonCount} labels={labels}/>
        </div>;
    }
}
