import React, { Component } from 'react';
import { Link } from 'react-router';
import{ Button , ButtonToolbar } from 'react-bootstrap';
import logo from './logo.jpg';
import './index.css';
import './App.css';

class index1 extends Component {
  render() {
    return (
      <div>

        <div className="inner cover">
          <h1 className="cover-heading">Twitter-clone</h1>
          <p className="lead">No matter your position, proper twitter clone  makes your conversation easier.</p>
        </div>
      </div>

    );
  }
}

export default index1;
