import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SQL from 'sql.js';
import axios from 'axios';

import Compass from './Compass.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.database = false;
		this.state = {
			lastGps: false,
			lastWind: false
		}
	}
	loaddatabase() {
		axios.get('/database.db', {responseType:'arraybuffer'})
			.then((resp) => {
				this.database = new SQL.Database(new Uint8Array(resp.data));
			});
	}
	_parseResult(result){
		let returnValue = [];
		return result.values.map(
			(resultRow) => resultRow.reduce(
				(r, c, i) => {
					r[result.columns[i]] = c;
					return r;
				}, {}
			)
		);
	}
	_getLatestDataRow(dataType){
		let data = this.database.exec(`select * from ${dataType} order by timestamp desc limit 1`)[0];
		return this._parseResult(data)[0];
	}
	getlatestinfofromdb(){
		let newState = {
			lastGps: this._getLatestDataRow('gps_records'),
			lastWind: this._getLatestDataRow('wind_records')
		};
		this.setState(newState);
	}
  render() {
    return (
      <div className="App">
        <p className="App-buttons">
		  <button onClick={this.loaddatabase.bind(this)}>LATAA DEEBEE</button>
		  <button onClick={this.getlatestinfofromdb.bind(this)}>PÄIVITÄ INFO</button>
        </p>
		<pre>
			<b>GPS</b> <br />
			Elevation: {this.state.lastGps.elevation} <br />
			Heading: {this.state.lastGps.heading} <br />
			Lat: {this.state.lastGps.lat} <br />
			Lon: {this.state.lastGps.lon} <br />
			Speed: {this.state.lastGps.speed} <br />
			Last updated: {this.state.lastGps.timestamp} <br />
			<b>Wind</b> <br />
			Direction: {this.state.lastWind.direction} <br />
			Speed: {this.state.lastWind.speed} <br />
			Last updated: {this.state.lastWind.timestamp} <br />
		</pre>
		<Compass lastRecord={this.state.lastGps}></Compass>
      </div>
    );
  }
}

export default App;