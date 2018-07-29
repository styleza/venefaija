import React, { Component } from 'react';
import './App.css';
import SQL from 'sql.js';
import axios from 'axios';
import './../node_modules/leaflet/dist/leaflet.css'
import connect from './location-provider';
import _settings from './settings'
import * as L from 'partial.lenses'
import Info from './Info';
import Compass from './Compass.js';
import Map from './Map.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.database = false;
		this.state = {
			lastGps: false,
			lastWind: false,
			mapOpen:false,
            connection: connect(this.getdata.bind(this)),
		}
		this.settings = _settings;
		this.mapTimeout = window.setTimeout(this.openmap.bind(this),2000);
		this.dbReloader = window.setInterval(this.loaddatabase.bind(this), 5000);
        this.loaddatabase();
	}
	loaddatabase() {
		axios.get('/database.db', {responseType:'arraybuffer'})
			.then((resp) => {
				this.database = new SQL.Database(new Uint8Array(resp.data));
                this.getlatestinfofromdb();
                this.database.close();
			});
	}
	getdata(){
		return this.state.lastGps;
	}
	_parseResult(result){
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
		try {
            let data = this.database.exec(`select * from ${dataType} order by timestamp desc limit 1`)[0];
            return this._parseResult(data)[0];
		}
		catch (err){
			console.log(err);
			return false;
		}

	}
	getlatestinfofromdb(){
		let newState = {
			lastGps: this._getLatestDataRow('gps_records'),
			lastWind: this._getLatestDataRow('wind_records')
		};
		this.setState(newState);
	}
    openmap(){
		this.setState({mapOpen:true});
	}
	setfollow(){
        this.settings.view(L.prop('follow')).modify(v => !v);
	}
  render() {
    return (
      <div style={{height:0}}>
		  <p className="controls-on-top">
			  <button onClick={this.setfollow.bind(this)}>F</button>
		  </p>
		<pre className="raw-data-on-top">
			<b>GPS (G):</b>
			Elevation: {this.state.lastGps && this.state.lastGps.elevation} /
			Heading: {this.state.lastGps && this.state.lastGps.heading} /
			Speed: {this.state.lastGps && this.state.lastGps.speed} /
			Lon: {this.state.lastGps && this.state.lastGps.lon} /
			Lat: {this.state.lastGps && this.state.lastGps.lat} /
			Last updated: {this.state.lastGps && this.state.lastGps.timestamp} <br />
			<b>Wind (W):</b>
			Direction: {this.state.lastWind && this.state.lastWind.direction} /
			Speed: {this.state.lastWind && this.state.lastWind.speed} /
			Last updated: {this.state.lastWind && this.state.lastWind.timestamp}
		</pre>
		  <Info name="WS" value={this.state.lastWind.speed}></Info>
		  <Compass name="GD" compass_value={this.state.lastGps.heading}></Compass>
		  <Compass name="WD" compass_value={this.state.lastWind.direction}></Compass>
		  {this.state.mapOpen && (<Map connection={this.state.connection} settings={this.settings}></Map>)}
      </div>
    );
  }
}

export default App;