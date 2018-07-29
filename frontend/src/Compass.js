import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line
import {} from '@fortawesome/fontawesome-free-solid';


class Compass extends Component {
	render() {
		return (
            <div className="compass-on-top">
                {this.props.name} <FontAwesomeIcon icon="location-arrow" transform={{rotate:this.props.compass_value-45}} />
                {Math.round(this.props.compass_value)}
            </div>
		);
	}
}

export default Compass;

