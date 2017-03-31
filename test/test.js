const request = require('supertest');
const app = require('../app');
// request = request('http://localhost:3000');
const should = require('should');

const user = {
  userdata: {
    id: 1,
    username: 'nidhi',
    password: 'nidhi',
    email: 'nidhi@gmail.com',
    image: '2567901bf9cbf2c5ede7317aba2379bc',
  },
};
const data = {
  data: 'hello',
  user_id: user.userdata.id,

};
const follow = {
  data: user.userdata.id,
  followerId: '60',
};
const editprofile = {
  userdata: {
    username: 'hetudi',
    password: '123',
    email: 'h@gmail.com',
    image: '2567901bf9cbf2c5ede7317aba2379bc',
  },
};
describe('index', () => {
  describe('GET /', () => {
    it('should return a indexpage', (done) => {
      request(app)
        .get('/')
        .expect('Content-type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) {
            done(err);
          }

          res.status.should.be.equal(200);
          done();
        });
    });
  });
});

describe('GET /login', () => {
  it('should return login page', (done) => {
    request(app)
    .get('/login')
    .expect('Content-type', 'text/html; charset=utf-8')
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(200);
        done();
      }
    });
  });
});

describe('GET /registration', () => {
  it('should return registration page', (done) => {
    request(app)
    .get('/registration')
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(200);
        done();
      }
    });
  });
});
describe('POST /registration', () => {
  it('user can register', (done) => {
    request(app)
      .post('/registration')
      .send(user)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});

describe('POST /login', () => {
  it('user can login', (done) => {
    request(app)
      .post('/login')
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          (res.body.userId).should.be.equal(user.userdata.id);
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
describe(`GET /home/${user.userdata.id}`, () => {
  it('return home page', (done) => {
    request(app)
    .get(`/home/${user.userdata.id}`)
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(200);
        done();
      }
    });
  });
});

describe(`GET /profile/${user.userdata.id}`, () => {
  it(' return profile page', (done) => {
    request(app)
    .get(`/profile/${user.userdata.id}`)
    .expect(200)
    .end((err, res) => {
      if (err) {
        done(err);
      } else {
        res.status.should.be.equal(200);
        done();
      }
    });
  });
});

describe('GET /twit', () => {
  it('should return a edit profile page', (done) => {
    request(app)
      .get('/twit')
      .expect(200)
      .end((err, res) => {
        res.status.should.be.equal(200);
        done();
      });
  });
});

describe('POST /twit', () => {
  it('user can tweet', (done) => {
    request(app)
      .post('/twit')
      .send(data)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
describe('POST /follow', () => {
  it('user can follow other user', (done) => {
    request(app)
      .post('/follow')
      .send(follow)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          (res.body.userId).should.be.equal(follow.data);
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
describe('POST /unfollow', () => {
  it('user can follow other user', (done) => {
    request(app)
      .post('/unfollow')
      .send(follow)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          res.status.should.be.equal(200);
          done();
        }
      });
  });
});
describe('GET /logout', () => {
  it('should return a main index page', (done) => {
    request(app)
      .get('/logout')
      .expect('Content-type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        res.status.should.be.equal(200);
        done();
      });
  });
});

describe(`editprofile/${user.userdata.id}`, () => {
  describe('GET /edit', () => {
    it('should return a edit profile page', (done) => {
      request(app)
        .get(`/edit/${user.userdata.id}`)
        .send(editprofile)
        .expect(200)
        .end((err, res) => {
          res.status.should.be.equal(200);
          done();
        });
    });
  });
});
