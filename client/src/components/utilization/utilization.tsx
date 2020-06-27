import React, {Component} from 'react';
import {Bar as ChartBar} from 'react-chartjs-2';
import * as chartjs from 'chart.js';

import './utilization.scss';

interface Props {
    data: number;
    maxCount: number
}

export default class Utilization extends Component {

    private static data = {

        data: {
            labels: ['Auslastung'],
            datasets: [
                {
                    label: 'Personen',
                    yAxisID: 'Counter',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [0],
                    maxBarThickness: 50,
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            tooltips: {
                position: 'nearest',
            },
            layout: {
                // padding: 25
            },

            responsive: true,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        labelString: 'Personenanzahl',
                        display: true,
                    },
                    id: 'Counter',
                    display: true,
                    ticks: {
                        min: 0,
                        max: 50,
                        stepSize: 5
                    }
                }, {
                    scaleLabel: {
                        labelString: 'Auslastung in %',
                        display: true,
                    },
                    id: 'percent',
                    position: 'right',
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
        }
    };

    state: { data: chartjs.ChartData, options: chartjs.ChartOptions } = {data: {}, options: {}};
    props!: Props;

    static getDerivedStateFromProps(newProps: Props, _: any) {
        const copy = {...Utilization.data};
        copy.data.datasets[0].data = [newProps.data];
        copy.options.scales.yAxes[0].ticks.max = newProps.maxCount;
        return copy;
    }

    render() {
        console.log(this.state);
        return (
            <div className="center">
                <h1>Aktuelle Auslastung</h1>
                <article className="bar">
                    <ChartBar data={this.state.data} options={this.state.options}/>
                </article>
            </div>
        );
    }
}



