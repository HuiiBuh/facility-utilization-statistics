import React, {Component} from "react";
import * as chartjs from "chart.js";
import {Line} from "react-chartjs-2";

class Graph extends Component {
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
                    label: "Temperature",
                    data: [22, 19, 27, 23, 22, 24, 17, 25, 23, 24, 20, 19, 22, 19, 27, 23, 22, 24, 17, 25, 23, 24, 20, 19],
                    fill: true,
                    borderWidth: 2,
                    backgroundColor: "#36a2eb",
                    borderColor: "#2d87c4"
                }
            ]
        };

        const options: chartjs.ChartOptions = {
            tooltips: {
                position: "average"
            },
            maintainAspectRatio: false
        };

        return (
            <article>
                <Line data={data} options={options}/>
            </article>
        );
    }
}

export default Graph;