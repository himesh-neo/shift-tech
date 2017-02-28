var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');
var OauthController = require('../controllers/oauthCtrl.js');

router.get('/wunderlistCallback', OauthController.connectWunderlist)


module.exports = router;
