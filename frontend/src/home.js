import React, { Component } from 'react';
import {Link,req,browserHistory} from 'react-router';
import {FormControl,FormGroup, ControlLabel,Col, Thumbnail,ListGroupItem,ListGroup, Button,image,Panel}from 'react-bootstrap';
import './home.css';
import logo from './logo.jpg';
import cookie from 'react-cookie';
import axios from 'axios';

class Home extends Component {
    constructor(props) {
    super(props);
    this.state={
      data:'',
      tweetText: '',
      tweeted: false,

    }
     this.ontweet = this.ontweet.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
     this.onfollow = this.onfollow.bind(this);
  }


    componentWillMount() {
      if(cookie.load(this.props.params.id)) {
        let userId = this.props.params.id;
         axios.get('http://localhost:8000/home/'+ userId)
         .then(res => {
            const data= res.data;
            console.log("-->", res.data);
          this.setState({
            data: data,
          })
      })
      } else {
      browserHistory.push('/login');
    }
  }

   onFieldChange(event){
    this.setState({
      [ event.target.name]: event.target.value
    });
  }
  onfollow(id) {
    let userId = this.props.params.id;
    axios.post('http://localhost:8000/follow', {
      data : this.state,
      followerId: id,
    })
    .then(function (response) {
      if (response.data.userId) {

        browserHistory.push("/home/" + response.data.userId)
      } else {
          browserHistory.push("/home/" + response.data.userId)
      }
    })
    .then(function (response) {
      location.reload();

    })
    .catch(function (error) {
      console.log(error);
    });
  }
  ontweet(e){
    console.log('ontweet----');
    let userId = this.props.params.id;

    axios.post('http://localhost:8000/twit', {
      data : this.state,
    })
    .then(function (response) {
      location.reload();

    })
    .catch(function (error) {
      console.log(error);
    });
    this.setstate({
      twitted: true
    })
    e.preventDefault(e);
  }


  render() {


    console.log("=---->",this.state.data);

    console.log(this.state.data.count,'----count');
    var twit = [];
     if(this.state.data.twits) {
      for (var i = 0; i < this.state.data.twits.length ; i++) {
        if(this.state.data.twits[i]) {
          twit.push(
                    <Panel header={this.state.data.twits[i].username}>
                      {this.state.data.twits[i].tweet_text}
                    </Panel>
                    /*<div  className="form-box">
                      <div className="form-top">
                        <div className="form-top-left">
                          <h3>{this.state.data.twits[i].tweet_text}</h3>
                        </div>
                        <div className="form-top-right">{this.state.data.twits[i].time} </div>
                      </div>
                      <hr/>
                      <div id="tweet" className="form-bottom">{this.state.data.twits[i].tweet_text}</div>
                    </div>*/


          );
        } else {

         twit.push(

                <Panel   key={i} header={this.state.data.twits[i].username}>
                      {this.state.data.twits[i].tweet_text}
                </Panel>

          );

        }
      }
    }

    var follower = [];

    if(this.state.data.follows) {

       for ( i = 0; i < this.state.data.follows.length ; i++) {

        if(this.state.data.follows) {
          let followimg= `http://localhost:8000/images/${this.state.data.follows[i].image}`;
          let a = this.state.data.follows[i].id;
          follower.push(


              <div key={i} className="profile-userpic">
                  <img name="profile"
                  src={followimg}
                  alt="www"
                  height="100px"
                  width="100px"
                  className=""/>
                  <div className="profile-usertitle">
                    <div className="profile-usertitle-name">
                    { this.state.data.follows[i].username}
                    </div>
                  </div>
                  <div className="profile-userbuttons">
                    <input type="hidden" name="followerId" value={a}/>
                    <Button type="submit"  id={a} onClick={this.onfollow.bind(this, a)} className="btn btn-success btn-sm">Follow</Button>

                  </div>
              </div>
          );
        }
      }
    }

    let username = '';
    let userimg ='';
    if(this.state.data.users){

       username = this.state.data.users[0].username;
       userimg = `http://localhost:8000/images/${this.state.data.users[0].image}`;
    }

    const home = (id) => `/home/${this.props.params.id}`;
    const My_ROUTE = (id) => `/profile/${this.props.params.id}`;
    const editprofile = (id) => `/editprofile/${this.props.params.id}`;
    return (
      <div>

        <div className="container">
          <div className="row profile">


              <Col xs={3} md={3}>
                <Thumbnail src={userimg}  alt="242x200">
                  <h3>{username}</h3>
                  <ListGroup>
                    <ListGroupItem href={home} active> <i className="glyphicon glyphicon-home"></i>Home</ListGroupItem>
                    <ListGroupItem href={My_ROUTE}><i className="glyphicon glyphicon-user"></i>Profile</ListGroupItem>
                    <ListGroupItem href={editprofile}><i className="glyphicon glyphicon-edit"></i>Edit Profile</ListGroupItem>
                    <ListGroupItem href=""><i className="glyphicon glyphicon-ok"></i>Follower<span className="badge">{this.state.data.count}
                      </span></ListGroupItem>
                  </ListGroup>


                </Thumbnail>
              </Col>






            <div className="col-md-6">
              <div className="twit">
                 <form action="/twit"  method="get">
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Tweet</ControlLabel>
                      <FormControl componentClass="textarea" name="tweetText" value={this.state.tweetText}
                        onChange={this.onFieldChange} placeholder="Add Your tweet.." maxLength="140" />
                    </FormGroup>

                      <Button type="submit" onClick={this.ontweet} className="btn btn-primary btn-md">Tweet</Button>
                  </form>
              </div>

              <div className="">
               {twit}
              </div>
            </div>
            <div className="col-sm-3">
              <div className="profile-content">
                <div className="sidebar-menu">
                  <p>

                    <h3>People you may know</h3>
                  </p>
                  <hr/>
                  <div className="">
                  {follower}
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

export default Home;

