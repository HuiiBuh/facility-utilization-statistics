import React from "react";
import APIClient from "../../api-client";
import {BarGraph} from "../../graphs";

interface State {
    maxPersonCount: number
    value: number
}

interface Props {
    facility: string
}

export default class Today extends React.Component {

    private static apiClient: APIClient = new APIClient("/api/facility/");

    state: State = {maxPersonCount: 0, value: 0};
    props: Props;

    constructor(props: Props) {
        super(props);
        this.props = props;
    }

    async componentDidMount(): Promise<void> {
        await this.startComponentUpdate();
    }

    async componentDidUpdate(previousProps: Props, __: Readonly<{}>, ___?: any) {
        if (this.props.facility !== previousProps.facility) {
            await this.startComponentUpdate();
        }
    }

    async startComponentUpdate(): Promise<void> {
        const response: any = await Today.apiClient.get(`${this.props.facility}/current`);
        this.setState(response);
    }

    shouldComponentUpdate(nextProps: Props, nextState: State, nextContext: any): boolean {
        const differentProps = nextProps.facility !== this.props.facility;
        const differentState = nextState.maxPersonCount !== this.state.maxPersonCount && nextState.value !== this.state.value;

        return differentProps || differentState;
    }

    render() {
        return <div>
            <BarGraph maxPersonCount={this.state.maxPersonCount} value={this.state.value}/>
        </div>;
    }
}
