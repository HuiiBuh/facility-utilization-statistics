import * as chartjs from "chart.js";
import React, {Component} from "react";
import {Bar as ChartBar} from "react-chartjs-2";

import "./bar-graph.scss";

interface Props {
    maxPersonCount: number
    value: number;
    color: string
    borderColor: string
}

export default class BarGraph extends Component {

    private static data = {

        data: {
            labels: ["Auslastung"],
            datasets: [
                {
                    label: "Prozent",
                    yAxisID: "percent",
                    data: [0],

                    backgroundColor: "rgb(0,0,0)",
                    hoverBackgroundColor: "rgb(0,0,0)",
                    borderColor: "rgb(0,0,0)",
                    hoverBorderColor: "rgb(0,0,0)",

                    borderWidth: 1,
                    maxBarThickness: 50,
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
                }, {
                    scaleLabel: {
                        labelString: "Personenanzahl",
                        display: true,
                    },
                    id: "counter",
                    display: true,
                    ticks: {
                        min: 0,
                        max: 0,
                        stepSize: 5
                    }
                }]
            }
        }
    };

    state: { data: chartjs.ChartData, options: chartjs.ChartOptions } = {data: {}, options: {}};
    props!: Props;

    static getDerivedStateFromProps(newProps: Props, _: any) {
        const copy = {...BarGraph.data};

        // Update data
        copy.data.datasets[0].data = [Math.floor(newProps.value)];
        copy.options.scales.yAxes[1].ticks.max = newProps.maxPersonCount;

        // Update color
        copy.data.datasets[0].backgroundColor = newProps.color;
        copy.data.datasets[0].hoverBackgroundColor = newProps.color;
        copy.data.datasets[0].borderColor = newProps.borderColor;
        copy.data.datasets[0].hoverBorderColor = newProps.borderColor;

        return copy;
    }

    render() {
        return (
            <div className="text-center">
                <article className="bar">
                    <ChartBar data={this.state.data} options={this.state.options}/>
                </article>
            </div>
        );
    }
}



