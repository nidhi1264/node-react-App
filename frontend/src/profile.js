import React, { Component } from 'react';
import {Link,req,browserHistory} from 'react-router';
import {FormControl,FormGroup, ControlLabel,Col, Thumbnail,ListGroupItem,ListGroup, Button,image,Panel}from 'react-bootstrap';
import axios from 'axios';

// import cover from '../public/images/cover.jpg';
import cookie from 'react-cookie';
import './profile.css';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state={
      data:'',
       tweetText: '',
      tweeted: false,
    }
    //this.onEdit = this.onEdit.bind(this);
    this.ontweet = this.ontweet.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
     this.onUnfollow = this.onUnfollow.bind(this);
  }
  onHandlePage(){
    if(cookie.load(this.props.params.id)) {
      let userId = this.props.params.id;
      axios.get('http://localhost:8000/profile/' + userId)
      .then(res => {
      // console.log(res);
        const data= res.data;
        this.setState({
          data: data,
        })
      });
     } else {
      browserHistory.push('/login');
    }
  }
  componentWillMount() {
    this.onHandlePage();

  }
  onUnfollow(id) {
    let self =this;
    let userId = this.props.params.id;
    axios.post('http://localhost:8000/unfollow', {
      data : this.props.params.id,
      followerId: id,
    })
    .then(function (response) {
      if (response.data.userId) {

        browserHistory.push("/profile/" + response.data.userId)
      } else {
          browserHistory.push("/home/" + response.data.userId)
      }
    })
    .then(function (response) {
      self.onHandlePage();

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onFieldChange(event){
    this.setState({
      [ event.target.name]: event.target.value
    });
  }


  ontweet(e){
  console.log('ontweet----');
  let userId = this.props.params.id;
  console.log('------wadsujxz', this.props.params.id)
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

      var twit = [];
        if(this.state.data.twits) {

          console.log( this.state.data.twits,'----in ');
          for (var i = 0; i < this.state.data.twits.length ; i++) {
            if(this.state.data.twits[i]) {
              twit.push(

                     <Panel header={this.state.data.twits[i].username}  >
                      {this.state.data.twits[i].tweet_text}
                    </Panel>


              );
            } else {

              twit.push(
                  <div  key={i}  className="col-sm-6">
                    <div  className="row">
                      <div className="form-box">
                        <div className="form-top">
                          <div className="form-top-left">
                            <h3>{this.state.data.twits[i].username}</h3>
                          </div>
                          <div key={i}className="form-top-right">{this.state.data.twits[i].time} </div>
                        </div>
                        <hr/>
                        <div key={i} id="tweet" className="form-bottom">{this.state.data.twits[i].tweet_text}</div>
                      </div>
                    </div>
                  </div>

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
                    src={ followimg }
                    alt="www"
                    height="100px"
                    width="100px"/>
                    <div className="profile-usertitle">
                      <div className="profile-usertitle-name">
                      { this.state.data.follows[i].username}
                      </div>
                    </div>
                    <div className="profile-userbuttons">
                       <input type="hidden" name="followerId" value={a}/>
                      <Button type="submit" id={a} onClick={ (e) => {
                    this.onUnfollow(a);
                    e.preventDefault();
                  }} className="btn btn-danger btn-sm">UnFollow</Button>

                    </div>
                </div>
            );
          }
        }
      }

      let username= '';
      let userimg='';
      console.log(this.state.data,'--->userdata')
      if(this.state.data.users){

         username= this.state.data.users[0].username;
         console.log(username, '------->>>>>>>>user');
         userimg= `http://localhost:8000/images/${this.state.data.users[0].image}`;
      }

    const editprofile = (id) => `/editprofile/${this.props.params.id}`;
    const home = (id) => `/home/${this.props.params.id}`;
    const My_ROUTE = (id) => `/profile/${this.props.params.id}`;

    return(
        <div>
          <div className="container">
          <div className="row profile">
              <Col xs={3} md={3}>
                <Thumbnail src={userimg}  alt="242x200">
                  <h3>{username}</h3>
                  <div className="list-group">
                    <Link to={home} className="list-group-item active"> <i className="glyphicon glyphicon-home"></i>Home</Link>
                    <Link to={My_ROUTE} className="list-group-item "><i className="glyphicon glyphicon-user"></i>Profile</Link>
                    <Link to={editprofile} className="list-group-item"><i className="glyphicon glyphicon-edit"></i>Edit Profile</Link>
                    <Link to="" className="list-group-item"><i className="glyphicon glyphicon-ok"></i>Follower<span className="badge">{this.state.data.count}
                      </span></Link>
                  </div>
                </Thumbnail>
              </Col>
            <div className="col-md-6">
                 <div className="profile-content twit">
                   <form action="/twit"  method="get">
                     <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>Tweet</ControlLabel>
                        <FormControl componentClass="textarea" name="tweetText"  value={this.state.tweetText}
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
                    <i className="glyphicon glyphicon-user">&nbsp;
                    </i>
                      Follower
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

export default Profile;
