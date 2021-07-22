var request = require('request');
var express = require('express');
var router = express.Router();

/*
  ALL OF THE ROUTES IN THIS PAGE REQUIRE AN AUTHENTICATED USER
*/

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log(req.user)

  res.render('users', {
    title: 'Users',
    user: req.user
  });
});

/* GET the profile of the current authenticated user */
router.get('/profile', function(req, res, next) {
  request.get(
    `${ process.env.OIDC_BASE }/protocol/openid-connect/userinfo`,
    {
    'auth': {
      'bearer': req.session.accessToken
    }
  },function(err, response, body){

    console.log("response of profile")
    console.log("err")
    console.log(err)
    console.log('User Info')
    console.log(body);

    res.render('profile', {
      title: 'Profile',
      user: JSON.parse(body)
    });

  });
});

/* GET the profile of the current authenticated user */
router.get('/echo-api', function(req, res, next) {
  request.get(
    `${ process.env.UPSTREAM_ENDPOINT }/pets`,
    {
    'auth': {
      'bearer': req.session.accessToken
    }
  },function(err, response, body){
    console.log("response of echo api")
    console.log("err")
    console.log(err)
    console.log('Echo api response')
    console.log(body);

    res.render('echoapi', {
      title: 'Echo API',
      data: JSON.stringify(JSON.parse(body), null, "   ")
    });

  });
});

module.exports = router;
