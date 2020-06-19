import React, {Component} from "react";
import * as chartjs from "chart.js";
import {Line} from "react-chartjs-2";

class Graph extends Component {
    render() {
        const data: chartjs.ChartData = {
            labels: [
                "10/04/2018", "10/05/2018",
                "10/06/2018", "10/07/2018",
                "10/08/2018", "10/09/2018",
                "10/10/2018", "10/11/2018",
                "10/12/2018", "10/13/2018",
                "10/14/2018", "10/15/2018"
            ],
            datasets: [
                {
                    label: "Temperature",
                    data: [22, 19, 27, 23, 22, 24, 17, 25, 23, 24, 20, 19],
                    fill: true,
                    borderWidth: 2,
                    backgroundColor: "#36a2eb",
                    borderColor: "#2d87c4"
                }
            ]
        };

        const options: chartjs.ChartOptions = {
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