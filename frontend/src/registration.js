import React, { Component } from 'react';
import { browserHistory} from 'react-router';
import {FormControl, FormGroup, Form , Col, ControlLabel, Checkbox, Button}from 'react-bootstrap';
import './login.css';
import axios from 'axios';

class Register extends Component {
  constructor(props) {
      super(props);
      this.state={
        username:'',
        email:'',
        password: '',
        photo:'',
        data:'' ,
        errors:{},
        }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

   handleSubmit(e){

  axios.post('http://localhost:8000/registration', {
    userdata: this.state,

  })

  .then(function (response) {

    if (response.data) {
      browserHistory.push("/login/")
    } else {
        browserHistory.push("/registration")
    }
  })
  .catch(function (error) {
    console.log(error);
  });
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
        <Form horizontal enctype='multipart/form-data'>
          <FormGroup controlId="formHorizontalEmail" >
            <h1> Register
            </h1>
          </FormGroup>
          <FormGroup controlId="formHorizontalusername">
            <Col componentClass={ControlLabel} sm={3}> Username
            </Col>
            <Col sm={9}>
              <FormControl type="text"  name='username' value={this.state.username} onChange={this.onFieldChange} placeholder="Username" />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}> Email
            </Col>
            <Col sm={9}>
              <FormControl type="email" name="email" value={this.state.email} onChange={this.onFieldChange} placeholder="Email" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <Col componentClass={ControlLabel} sm={3}> Password
            </Col>
            <Col sm={9}>
              <FormControl type="password" name="password" value={this.state.password} onChange={this.onFieldChange} placeholder="Password" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalimg">
            <Col componentClass={ControlLabel} sm={3}> Photo
            </Col>
            <Col sm={9}>
              <FormControl type="file" name="photo" value={this.state.photo} onChange={this.onFieldChange} placeholder="Choose your file " />
            </Col>
          </FormGroup>


          <FormGroup>
            <Col smOffset={3} sm={9}>
              <Checkbox>Remember me</Checkbox>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col smOffset={5} sm={9}>
              <Button type="submit" bsStyle="primary" onClick={this.handleSubmit} >
                Sign up
              </Button>
            </Col>
          </FormGroup>
    </Form>

    </div>
    );
  }
}

export default Register;

