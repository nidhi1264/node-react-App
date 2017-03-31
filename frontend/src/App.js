import React, { Component } from 'react';
import { Link } from 'react-router';
import logo from './logo.jpg';
import './App.css';

class App extends Component {
  render() {
    return (

      <div>
      <nav className="header">
          <ul>
            <li><Link to="/"><img src={logo} alt='logo' height='30'/></Link></li>
          </ul>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/registration">Register</Link></li>
          </ul>
        </nav>
        {this.props.children}
      </div>

    );
  }
}

export default App;
