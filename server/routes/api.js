var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var UserController = require('../controllers/userCtrl.js');
var OauthController = require('../controllers/oauthCtrl.js');


router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/logout', UserController.logout);

router.get('/status', UserController.status);

router.get('/oauth/wunderlistCallback', OauthController.connectWunderlist)


module.exports = router;
