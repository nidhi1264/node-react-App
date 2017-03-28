import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import {FormControl, FormGroup, Form , Col, ControlLabel,  Checkbox, Button}from 'react-bootstrap';
import './login.css';
import axios from 'axios';
import cookie from 'react-cookie';
// let request = axios.create({
//  withCredentials: true,
//  baseURL: 'http://localhost:8000/',
// });
class login extends Component {

    constructor(props) {
      super(props);
      this.state={
        email:'',
        password: '',
        data:'' ,
        errors:{},
        }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


   handleSubmit(e){

  axios.post('http://localhost:8000/login', {
    userdata: this.state,

  })
.then(function (response) {
    console.log(response.data.id)
    cookie.save(response.data.userId, 'user_id:'+ response.data.userId, { path: '/' });
    if (response.data.userId) {
      browserHistory.push("/home/" + response.data.userId)
    } else {
        browserHistory.push("/login")
    }
  })
  .catch(function (error) {
    console.log(error);
  });
  alert('Login Sucessfully');
    e.preventDefault(e);

    this.setState({
      showComponent: true,

    });
  }

  onFieldChange(event){
     this.setState({
      [ event.target.name]: event.target.value
    });
  }
  render() {

    console.log("from component:", this.state);
    return (

      <div>
        <Form horizontal method="" action='/login'>
          <FormGroup controlId="formHorizontalEmail">
            <h1> Login
            </h1>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}> Email
            </Col>
            <Col sm={9}>
              <FormControl type="email" placeholder="Email"  name="email" value={this.state.email} onChange={this.onFieldChange} required/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={3}> Password
            </Col>
            <Col sm={9}>
              <FormControl type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.onFieldChange} required/>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={3} sm={9}>
              <Checkbox>Remember me</Checkbox>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={5} sm={9}>
              <Button type="submit" bsStyle="primary" onClick={this.handleSubmit}>
                Sign in
              </Button>
            </Col>
          </FormGroup>
    </Form>

    </div>
    );
  }
}

export default login;

