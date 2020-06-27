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