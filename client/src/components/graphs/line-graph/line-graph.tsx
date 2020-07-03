import * as chartjs from "chart.js";
import React, {Component} from "react";
import {Line} from "react-chartjs-2";
import {TDay} from "../../facility/week-data/week-data.interfaces";

import "./line-graph.scss";

interface Props {
    labels: string[]
    data: { day: TDay, data: number[] }
    maxPersonCount: number
}

class LineGraph extends Component {

    props!: Props;

    state: { data: chartjs.ChartData, options: chartjs.ChartOptions } = {data: {}, options: {}};
    static data: { data: chartjs.ChartData, options: chartjs.ChartOptions } = {
        data: {
            labels: [
                "10:30", "10:00", "10:30", "10:00",
                "10:30", "10:00", "10:30", "10:00",
                "10:30", "10:00", "10:30", "10:00",
                "10:30", "10:00", "10:30", "10:00",
                "10:30", "10:00", "10:30", "10:00",
            ],
            datasets: [
                {
                    label: "Anzahl Personen",
                    data: [22, 19, 27, 23, 22, 24, 17, 25, 23, 24, 20, 19, 22, 19, 27, 23, 22, 24, 17, 25, 23, 24, 20, 19],
                    fill: true,
                    borderWidth: 2,
                    backgroundColor: "#2b998a",
                    borderColor: "#1f7166"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        labelString: "Personenanzahl",
                        display: true,
                    },
                    id: "Counter",
                    display: true,
                    ticks: {
                        min: 0,
                        max: 50,
                        stepSize: 5
                    }
                }, {
                    scaleLabel: {
                        labelString: "Auslastung in %",
                        display: true,
                    },
                    id: "percent",
                    position: "right",
                    display: true,
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        min: 0,
                        max: 100,
                        stepSize: 10
                    }
                }]
            }
        }
    };

    static getDerivedStateFromProps(newProps: Props, _: any) {
        const copy = {...LineGraph.data};
        console.log(newProps);
        return copy;
    }

    render() {

        return (
            <div className="line-graph-container text-center">
                <h2 className="line-graph-heading">Montag</h2>
                <Line data={this.state.data} options={this.state.options}/>
            </div>
        );
    }
}

export default LineGraph;