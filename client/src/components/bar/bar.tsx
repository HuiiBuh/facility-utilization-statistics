import React, {Component} from "react";
import {Bar as ChartBar} from "react-chartjs-2";
import * as chartjs from "chart.js";

import "./bar.scss";

class Bar extends Component {
    state: any;

    private data: chartjs.ChartData = {
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
                data: [20],
                maxBarThickness: 50,
            }
        ]
    };

    constructor(props: any) {
        super(props);
        this.state = this.data;
    }


    render() {


        const options: chartjs.ChartOptions = {
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

        return (
            <div className="center">
                <h1>Aktuelle Auslastung</h1>
                <button onClick={this.updateState.bind(this)}>Random number</button>
                <article className="bar">
                    <ChartBar data={this.data} options={options}/>
                </article>
            </div>
        );
    }

    updateState() {
        const value = Math.random() * 50;
        if (this.data.datasets) {
            this.data.datasets[0].data = [value];
        }
        this.setState(this.data);
    }
}

export default Bar;

// Year Month Estimation Today

