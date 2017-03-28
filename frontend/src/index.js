import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory , IndexRoute} from 'react-router';
import App from './App';
import login from './login';
import index1 from './index1';
import Register from './registration';
import Home from './home';
import Nav from './nav';
import Profile from './profile';
import Editprofile from './editprofile';
import './index.css';


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute path="/" component={index1} />
      <Route path="/login" component={login}/>
      <Route path="/registration" component={Register}/>
    </Route>
    <Route path="/home/:id" component={Nav}>
      <IndexRoute path="/home/:id" component={Home} />
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/editprofile/:id" component={Editprofile}/>

    </Route>


  </Router>

), document.getElementById('root'));
