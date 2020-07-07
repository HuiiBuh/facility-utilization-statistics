import React, {Component} from "react";
import {Line} from "react-chartjs-2";

import "./line-graph.scss";

interface Props {
    labels: string[]
    data: number[]
    maxPersonCount: number
}

class LineGraph extends Component {

    props!: Props;

    static data = {
        day: "",
        data: {
            labels: [""],
            datasets: [
                {
                    label: "Auslastung in %",
                    yAxisID: "percent",
                    data: [0],

                    backgroundColor: "#2b998a",
                    borderColor: "#1f7166",

                    fill: true,
                    borderWidth: 2,
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
                    id: "Counter",
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

    render() {
        const copy = JSON.parse(JSON.stringify(LineGraph.data));
        copy.data.labels = this.props.labels;
        copy.data.datasets[0].data = this.props.data;
        copy.options.scales.yAxes[1].ticks.max = this.props.maxPersonCount;

        return (
            <div className="line-graph-container text-center">
                <div>
                    <Line data={copy.data} options={copy.options}/>
                </div>
            </div>
        );
    }
}

export default LineGraph;