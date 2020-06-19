import React, {Component} from "react";
import {Bar as ChartBar} from "react-chartjs-2";
import * as chartjs from "chart.js";

class Bar extends Component {
    render() {
        const data: chartjs.ChartData = {
            labels: ["Auslastung"],
            datasets: [
                {
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: [65],
                    maxBarThickness: 100
                }
            ]
        };

        const options: chartjs.ChartOptions = {
            maintainAspectRatio: false,
        };

        return (
            <article>
                <ChartBar data={data} width={100} height={500} options={options}/>
            </article>
        );
    }
}

export default Bar;