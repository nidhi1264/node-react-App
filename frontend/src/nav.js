import React, { Component } from 'react';
import { Link,browserHistory,Glyphicon } from 'react-router';
import logo from './logo.jpg';
import './App.css';
import cookie from 'react-cookie';
import axios from 'axios';
class Nav extends Component {

  constructor(props) {
    super(props);
    this.state={
      data:'',


    }

     this.handleLogout = this.handleLogout.bind(this);
  }

   handleLogout(e)
  {
    let id = this.props.params.id;
    axios.get('http://localhost:8000/logout', {
      userdata: this.state,
    })
    .then(function (response) {
      cookie.remove(id, { path: '/' });
      browserHistory.push('/login');
    })
    .catch(function (error) {
      console.log(error);
    });
      e.preventDefault(e);
  }
  render() {
    const My_ROUTE = (id) => `/profile/${this.props.params.id}`;

    return (
      <div>

        <nav className="header">
          <ul>
            <li><Link to="/"><img src={logo} alt='logo' height='30'/></Link></li>
          </ul>
          <ul>
            <li><Link to={My_ROUTE}>Profile</Link></li>

            <li><Link to="/login" onClick={this.handleLogout}>Logout</Link></li>
          </ul>
        </nav>
         {this.props.children}
      </div>

    );
  }
}

export default Nav;
