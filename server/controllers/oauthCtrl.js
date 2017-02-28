var User = require('../models/user.js');
var passport = require('passport');

exports.connectWunderlist = function(req, res) {
  code = req.query.code
  User.connectWunderlistAccount(code, req.user);
  console.log(req.query.code);
};
