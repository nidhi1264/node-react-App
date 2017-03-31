import React, { Component } from 'react';
import {FormControl,FormGroup, ControlLabel, Col, Button,Panel, Image,Thumbnail }from 'react-bootstrap';
import { Link,browserHistory } from 'react-router';
import './editprofile.css';
import axios from 'axios';
import cookie from 'react-cookie';

class Editprofile extends Component {
    constructor(props) {
    super(props);
    this.state={
      data:'',
      username: '',
      password: '' ,
      image: '',
      userdata: '',


    }
    this.onFieldChange = this.onFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
   componentWillMount() {
    if(cookie.load(this.props.params.id)) {
      let userId = this.props.params.id;
      axios.get('http://localhost:8000/edit/' + userId)
      .then(res => {
        console.log(res,'------');
        const data= res.data;
        this.setState({
          data: data,
        })
      });
     } else {
      browserHistory.push('/login');
    }

  }
   onFieldChange(event){
    this.setState({
      [ event.target.name]: event.target.value
    });
  }
  handleSubmit(e){
  let userId = this.props.params.id;
  axios.post('http://localhost:8000/edit/'+ userId, {
    userdata: this.state,

  })

  .then(function (response) {
    console.log(response.data,'response----->>>')
    if (response.data) {
      browserHistory.push('/home/'+ userId)
    } else {
        browserHistory.push('/editprofile' + userId)

    }
  })
  .catch(function (error) {
    console.log(error);
  });
   e.preventDefault(e);


  }
  render() {
    let username = '';
    let email ='';
    let userimg ='';
    console.log(this.state.data.users,'-----djfhdnms')
    if(this.state.data.users){

      username = this.state.data.users[0].username;
      email = this.state.data.users[0].email;
      userimg = `http://localhost:8000/images/${this.state.data.users[0].image}`

    }


    console.log('from component...profieedit:', this.state);
    const home = (id) => `/home/${this.props.params.id}`;
    const My_ROUTE = (id) => `/profile/${this.props.params.id}`;
    const editprofile = (id) => `/editprofile/${this.props.params.id}`;
    return (
      <div>
        <div className='container'>
          <div className='row profile'>
            <Col xs={3} md={3}>
                <Thumbnail src={userimg}  alt='242x200'>
                  <h3>{username}</h3>
                  <div className='list-group'>
                    <Link to={home} className='list-group-item '> <i className='glyphicon glyphicon-home'></i>Home</Link>
                    <Link to={My_ROUTE} className='list-group-item '><i className='glyphicon glyphicon-user'></i>Profile</Link>
                    <Link to={editprofile} className='list-group-item active'><i className='glyphicon glyphicon-edit'></i>Edit Profile</Link>
                    <Link to='' className='list-group-item'><i className='glyphicon glyphicon-ok'></i>Follower<span className='badge'>{this.state.data.count}
                      </span></Link>
                  </div>


                </Thumbnail>
            </Col>
            <div className='col-md-6'>
              <div className='panel panel-default'>
                  <div className='panel-body'>
                      <h1 className='panel-title pull-left'>Edit profile</h1>
                  </div>
              </div>

              <div className='panel panel-default'>
                    <div className='panel-body'>
                        <h3 className='panel-title pull-left'>Your Info</h3>

                        <form className='form-horizontal'>
                            <label for='username'>Username</label>
                            <input type='text' className='form-control' name='username'  onChange={this.onFieldChange}value={this.state.data.username} placeholder={username} />
                            <label for='email'>Email</label>
                            <input type='email' className='form-control' name='email'  onChange={this.onFieldChange} value={this.state.data.email} placeholder={email} />
                            <label for='password'>Password</label>
                            <input type='password' className='form-control' name='password'  onChange={this.onFieldChange} value ={this.state.data.password} placeholder='*********' />
                            <br />
                            <Button type='submit' className='btn btn-primary btn-sm' onClick={this.handleSubmit}>Submit</Button>


                        </form>
                    </div>
            </div>

            <div className='panel panel-default'>
                <div className='panel-body'>
                    <h3 className='panel-title pull-left'>Your photo</h3>
                    <br/><br/>
                    <div className='edituser'>
                        <div className='col-lg-12 col-md-12'>
                            <img className='img-thumbnail img-responsive' src={userimg} width='100px' height='100px' alt='edituser'/>
                        </div>
                        <div className='col-lg-7 col-md-5'>
                            <button className='btn btn-primary'><i className='fa fa-upload' aria-hidden='true'></i> Upload a new profile photo!</button>

                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
      );
    }
  }

export default Editprofile;
