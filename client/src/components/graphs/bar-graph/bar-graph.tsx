import React, {Component} from "react";
import {Bar as ChartBar} from "react-chartjs-2";
import * as chartjs from "chart.js";

import "./bar-graph.scss";

interface Props {
    maxPersonCount: number
    value: number;
}

export default class BarGraph extends Component {

    private static data = {

        data: {
            labels: ["Auslastung"],
            datasets: [
                {
                    label: "Prozent",
                    yAxisID: "percent",
                    backgroundColor: "rgb(255,153,0)",
                    hoverBackgroundColor: "rgb(255,153,0)",
                    borderColor: "rgb(236,134,9)",
                    hoverBorderColor: "rgb(236,134,9)",
                    borderWidth: 1,
                    data: [0],
                    maxBarThickness: 50,
                }
            ]
        },

        // RED rgb(205,65,65) rgb(205,65,36)
        // GREEN rgb(129,191,46) rgb(99,154,26)
        // ORANGE rgb(255,153,0) rgb(236,134,9)

        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            responsive: true,
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
                        max: 50,
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
        copy.data.datasets[0].data = [Math.floor(newProps.value)];
        copy.options.scales.yAxes[1].ticks.max = newProps.maxPersonCount;
        return copy;
    }

    render() {
        return (
            <div className="center">
                <article className="bar">
                    <ChartBar data={this.state.data} options={this.state.options}/>
                </article>
            </div>
        );
    }
}



