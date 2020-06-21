import React, {Component} from "react";
import {Bar as ChartBar} from "react-chartjs-2";
import * as chartjs from "chart.js";

import "./bar.scss";


class Bar extends Component {

    state: chartjs.ChartOptions = {};
    props!: { data: number[] };

    private readonly chartOptions: chartjs.ChartOptions = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        tooltips: {
            position: "nearest",
        },
        layout: {
            // padding: 25
        },

        responsive: true,
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
    private static data = {
        labels: ["Auslastung"],
        datasets: [
            {
                label: "Personen",
                yAxisID: "Counter",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: [],
                maxBarThickness: 50,
            }
        ]
    };

    static getDerivedStateFromProps(newProps: any, state: any) {
        const copy = {...Bar.data};
        copy.datasets[0].data = newProps.data;
        return copy;
    }

    render() {
        return (
            <div className="center">
                <h1>Aktuelle Auslastung</h1>
                <article className="bar">
                    <ChartBar data={Bar.data} options={this.chartOptions}/>
                </article>
            </div>
        );
    }
}

export default Bar;

// Year Month Estimation Today

