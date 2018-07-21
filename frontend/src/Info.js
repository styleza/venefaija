import React, { Component } from 'react';



class Info extends Component {
	render() {
		return (
            <div className="info-on-top">
                {this.props.name}: {Math.round(this.props.value)}
            </div>
		);
	}
}

export default Info;

