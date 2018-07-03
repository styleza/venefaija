import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SQL from 'sql.js';
import axios from 'axios';
import ReactHighcharts from 'react-highcharts';

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
	getlatestinfofromdb(){
		let newState = {
			lastGps: this.database.exec('select * from gps_records order by timestamp desc limit 1')[0].values,
			lastWind: this.database.exec('select * from wind_records order by timestamp desc limit 1')[0].values
		};
		this.setState(newState);
		console.log(newState);
	}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
		  <button onClick={this.loaddatabase.bind(this)}>LATAA DEEBEE</button>
		  <button onClick={this.getlatestinfofromdb.bind(this)}>PÄIVITÄ INFO</button>
        </p>
		<pre>
			{this.state.lastGps}
			<br/>
			{this.state.lastWind}	
		</pre>
      </div>
    );
  }
}

export default App;