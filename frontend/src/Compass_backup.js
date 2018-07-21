import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
import HighCharts from 'highcharts';
import HighchartsMore from 'highcharts-more';

HighchartsMore(ReactHighcharts.Highcharts);


const HCConf = {
        chart: {
            renderTo: 'container',
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            backgroundColor:'rgba(255, 255, 255, 0.0)',
            height:'200px'
        },

        title: {
            text: ''
        },
        
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
           
        // the value axis
        yAxis: {
            min: 0,
            max: 360,
            tickWidth: 1,
            tickPosition: 'outside',
            tickLength: 20,
            tickColor: '#999',
            tickInterval:45,
            labels: {
                rotation: 'auto',
                formatter:function(){
                    if(this.value === 360) { return 'N'; }
                    else if(this.value === 45) { return 'NE'; }
                    else if(this.value === 90) { return 'E'; }
                    else if(this.value === 135) { return 'SE'; }
                    else if(this.value === 180) { return 'S'; }
                    else if(this.value === 225) { return 'SW'; }
                    else if(this.value === 270) { return 'W'; }
                    else if(this.value === 315) { return 'NW'; }
                }
            },
            title: {
                text: ''
            }},
    
        series: [{
            name: 'GPS Direction',
            data: [0],
            tooltip: {
                valueSuffix: ' direction'
            }
        }]
    
    };

class Compass extends Component {
    constructor(props){
        super(props);

        this.HCConf = Object.assign({}, HCConf);
    }
	componentWillReceiveProps(p){
		if(this.handle && p.compass_value){
			let val = Math.round(p.compass_value);
			this.handle.getChart().update({series: [{data: [val]}]});
		}
	}
	render() {
        this.HCConf.yAxis.title = this.props.name;
        this.HCConf.series[0].name = this.props.name;
		return (
			<div className="compass-on-top">
                <ReactHighcharts ref={(handle) => {this.handle = handle}} config={this.HCConf}></ReactHighcharts>
            </div>
		);
	}
}

export default Compass;

