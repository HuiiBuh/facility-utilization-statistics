import React, {Component} from "react";
import * as chartjs from "chart.js";
import {Line} from "react-chartjs-2";

import "./line-graph.scss";

class LineGraph extends Component {

    render() {
        const data: chartjs.ChartData = {
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
        };

        const options: chartjs.ChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
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
        };

        return (
            <article className="line-graph-container">
                <Line data={data} options={options}/>
            </article>
        );
    }
}

export default LineGraph;