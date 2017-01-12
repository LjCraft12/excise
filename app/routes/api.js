var User    = require('..//models/user');
var jwt     = require('jsonwebtoken');
var secret  = 'CBAB340E4E';

module.exports = function (router) {
    {
        //http://localhost:3000/api/users
        //User Registration route
        router.post('/users', function (req, res) {
            // res.send('Im here don\'t worry');
            var user = new User();
            user.email = req.body.email;
            user.password = req.body.password;
            user.username = req.body.username
            if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
                res.json({success: false, message: 'Ensure email, username, and password we provided'})
            } else {
                user.save(function (err) {
                    if (err) {
                        res.json({success: false, message: 'Username or email already exists'});
                    } else {
                        res.json({success: true, message: 'User Created'});
                    }
                });
            }
        });

        //User login route
        // http://localhost:port/api/authenticate
        router.post('/authenticate', function (req, res) {
           User.findOne({ username: req.body.username }).select('email username password').exec(function (err, user) {
              if (err) throw err;

              if (!user) {
                  res.json({ success: false, message: 'Could not authenticate user' });
              }else if (user){
                  if (req.body.password){
                      var validPassword = user.comparePassword(req.body.password);
                  } else{
                      res.json({ success: false, message: 'No password provided' })
                  }
                  if (!validPassword) {
                      res.json({ success: false, message: 'Could not authenticate password'});
                  }else {
                      var token = jwt .sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h'} );
                      res.json({ success: true, message: 'User Authenticated', token: token });
                  }
              }
           });
        });

        router.use(function (req, res, next) {
            var token = req.body.token || req.body.query || req.headers['x-access-token'];

            if (token) {
                //verify token
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Token invalid'});
                    }else {
                        req.decoded = decoded;
                        next();
                    }
                });
            }else {
                res.json({ success: false, message: 'No token provided'});
            }
        });

        router.post('/currentuser', function (req, res) {
            res.send(req.decoded)
        });

        return router;
    }
};