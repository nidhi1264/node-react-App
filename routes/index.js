const express = require('express');
const DB = require('../helpers/db');

const router = express.Router();

const path = require('path');
const multer = require('multer');

const upload = multer({ dest: path.resolve(__dirname, '../public/images/') });
// GET: /
router.get('/', (req, res, next) => {
  // Constuct and run a simple query
  const query = DB.builder()
    .select()
    .function('NOW()')
    .toParam();

  DB.executeQuery(query, (error, results) => {
    if (error) {
      next(error);
      return;
    }
    res.render('index', {
      title: `reg ${results.rows[0].now}`,
    });
  });
});

router.post('/registration', upload.single('file'), (req, res, next) => {

  const session = req.session;
  const username = req.body.userdata.username;
  const email = req.body.userdata.email;
  const password = req.body.userdata.password;
  const photo = req.body.userdata.photo;
  console.log("body:", req.body.userdata.email);
  // let photo = '';
  // if (req.file) {
  //   photo = req.file.filename;
  // } else {
  //   photo = 'sun.jpg';
  // }
  // req.checkBody('username', 'Username is required').notEmpty();
  // req.checkBody('password', 'Password is required').notEmpty();
  // req.checkBody('password', 'Password have min 2 and max 8 character').len(2, 8);
  // req.checkBody('email', 'Email is required').notEmpty();
  // req.checkBody('email', 'Email is not valid').isEmail();
  // req.checkBody('photo', 'Image is required').notEmpty();
  // const errors = req.validationErrors();
  // if (errors) {
  //   console.log('FAILED');
  //   res.render('registration', {
  //     errors,
  //   });
  //   console.log(errors);
  // } else {
    const query = DB.builder()
      .insert()
      .into('registration')
      .set('username', username)
      .set('password', password)
      .set('email', email)
      .set('image', photo)
      .toParam();
    DB.executeQuery(query, (err,data) => {
      if (err) {
        next(err);
        return;
      }


      let object={
          data: data.rows
      }
      console.log(object)
      res.end( JSON.stringify(object));
    });

});
router.post('/login', (req, res, next) => {
  const session = req.session;
  const email = req.body.userdata.email;

  const password = req.body.userdata.password;

    const query = DB.builder()
      .select()
      .field('email')
      .field('id')
      .field('username')
      .field('password')
      .from('registration')
      .where('email = ? AND password = ?',email, password)
      .toParam();

    DB.executeQuery(query, (error, data) => {

      if (error) {
        next(error);
        return;
      }
      else if(data.rowCount){
        console.log(data.rowCount);
        session.email= email;
        session.userId = data.rows[0].id;
       }

       let object={
          userId: session.userId,
        }

      res.send(object);

    });

});

router.get('/home/:id', (req, res, next) => {

  let query;
  let userId = req.params.id;
  console.log(userId,'------session');
   if (userId) {


    query = DB.builder()
      .select()
      .field('username')
      .field('tweet_text')
      .field('time')
      .from('registration', 'r')
      .join(DB.builder().select().from('twit'), 'u', 'r.id = u.user_id ')
      .where('u.user_id IN ? OR u.user_id = ?',
      (DB.builder().select().field('follower_id').from('follow')
      .where('login_user= ?',userId)), userId)
      .order('time', false)
      .toParam();
    DB.executeQuery(query, (error, twits) => {
      if (error) {
        next(error);
        return;
      }
      query = DB.builder()
      .select()
      .from('registration')
      .where('id != ?',userId)
      .where('id NOT IN ?',
      DB.builder()
      .select()
      .field('follower_id')
      .from('follow')
      .where('login_user = ?', userId))
      .toParam();
      DB.executeQuery(query, (err, follows) => {
        if (err) {
          next(err);
          return;
        }

        query = DB.builder()
          .select()
          .field('username')
          .field('image')
          .field('id')
          .from('registration', 'r')
          .where('id = ?', userId)
          .toParam();
        console.log(query);
        DB.executeQuery(query, (errors, users) => {
          if (errors) {
            next(errors);
            return;
          }
          query = DB.builder()
          .select()
          .from('follow')
          .where('login_user= ?', userId)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }

          let object= {
            count: c.rows.length,
               users: users.rows,
                twits: twits.rows,
                follows: follows.rows,
              }
              console.log(object,'-------home')
              res.end( JSON.stringify(object));
        });
        });
      });
    });
  }
});


router.post('/follow', (req, res, next) => {
  console.log('follow called');
 let id = req.body.followerId;
  console.log('follow called',id);
 let userId = req.body.data;
 console.log('follow called',userId);
  const query = DB.builder()
    .insert()
    .into('follow')
    .set('login_user', userId)
    .set('follower_id', id)
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    let object={
        "userId" : userId
      }
      res.send(object);
  });
});

router.post('/unfollow', (req, res, next) => {
  console.log('unfollow')
   let id = req.body.followerId;

 let userId = req.body.data;
  const query = DB.builder()

    .delete()
    .from('follow')
    .where('follower_id = ?', id)
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    let object={
        "userId" : userId
      }
      res.send(object);
  });
});

router.get('/profile/:id', (req, res, next) => {
 let userId = req.params.id;
  let query;

if(userId)
{
    query = DB.builder()
      .select()
      .field('email')
      .field('username')
      .field('tweet_text')
      .field('time')
      .from('registration', 'r')
      .join(DB.builder().select().from('twit'), 'u', 'u.user_id =r.id')
      .where('r.id = ? ', userId)
      .toParam();
    console.log(query);
    DB.executeQuery(query, (errors, twits) => {
      if (errors) {
        next(errors);
        return;
      }
      query = DB.builder()
        .select()
        .field('username')
        .field('follower_id')
        .field('id_f')
        .field('id')
        .field('image')
        .from('registration', 'r')
        .join(DB.builder()
        .select()
        .from('follow'), 'f', 'r.id= f.follower_id')
        .where('login_user = ?', userId)
        .toParam();
      DB.executeQuery(query, (err, follows) => {
        if (err) {
          next(err);
          return;
        }
        query = DB.builder()
        .select()
        .field('username')
        .field('image')
        .field('id')
        .from('registration', 'r')
        .where('id = ?', userId)
        .toParam();
        console.log(query);
        DB.executeQuery(query, (errors, users) => {
        if (errors) {
          next(errors);
          return;
        }
          query = DB.builder()
          .select()
          .from('follow')
          .where('login_user = ?', userId)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }
         let object= {
           users: users.rows,
            twits: twits.rows,
            count: c.rows.length,
            follows: follows.rows,

          }
        res.end(JSON.stringify(object));
      });
    });
    });
  });
  }
});

// router.get('/twit', (req, res) => {
//   res.render('twit');
// });

router.post('/twit', (req, res, next) => {
  console.log('twitt called',req.body)
  let userId = req.body.user_id;
  const tweetText = req.body.data;
console.log('twitttt=----', userId);

  const query = DB.builder()
    .insert()
    .into('twit')
    .set('tweet_text', tweetText)
    .set('time', 'Now()')
    .set('user_id', userId)
    .toParam();

  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    let object ={
      "userId" : userId
    }
    res.end(JSON.stringify(object));
  });
});


router.get('/edit/:id', (req, res, next) => {
  let userId = req.params.id;
  console.log(userId,'-------jrgdfvcm')
  if (userId) {
    const query = DB.builder()
      .select()
      .field('email')
      .field('username')
      .field('password')
      .field('image')
      .from('registration')
      .where('id = ?', userId)
      .toParam();
    DB.executeQuery(query, (error, users) => {
      if (error) {
        next(error);
        return;
      }
      const query = DB.builder()
          .select()
          .from('follow')
          .where('login_user = ?', userId)
          .toParam();
          DB.executeQuery(query, (errortweets, c) => {
            if (errortweets) {
              next(errortweets);
              return;
            }
      let object ={
        count:c.rows.length,
        users: users.rows,
      }
      res.end(JSON.stringify(object));
    });
  });
  }
});
// router.get('/editprofile', (req, res, next) => {
//   const session = req.session;
//   if (session.mail) {
//     const query = DB.builder()
//       .select()
//       .field('image')
//       .from('registration')
//       .where('id = ?', session.user_id)
//       .toParam();
//     DB.executeQuery(query, (error, results) => {
//       if (error) {
//         next(error);
//         return;
//       }
//       res.render('edit', { res: results.rows });
//     });
//   } else {
//     res.render('login');
//   }
// });
router.post('/editprofile', upload.single('file'), (req, res, next) => {
  let photo = '';
  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = 'sun.jpg';
  }
  const query = DB.builder()
    .update()
    .table('registration')
    .set('image', photo)
    .where('id = ? ', userId)
    .toParam();
  DB.executeQuery(query, (error) => {
    if (error) {
      next(error);
      return;
    }
    res.redirect('/home');
  });
});
router.post('/edit/:id', upload.single('file'), (req, res, next) => {
  const username = req.body.userdata.username;
  const password = req.body.userdata.password;
  const email = req.body.userdata. email;
  const userId = req.params.id;
  console.log(userId,'-----edit post');
  const query = DB.builder()
    .update()
    .table('registration')
    .set('username', username)
    .set('password', password)
    .set('email', email)
    .where('id = ?', userId)
    .toParam();
  DB.executeQuery(query, (error,data) => {
    if (error) {
      next(error);
      return;
    }
     let object ={
        data: data.rows,
    }
    res.end(JSON.stringify(object));
  });
});

router.get('/logout', (req, res) => {
  const session = req.session;
    req.session.destroy(() => {
    res.end();
  });
});

module.exports = router;
