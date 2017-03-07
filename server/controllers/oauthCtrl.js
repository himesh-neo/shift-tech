var User = require('../models/user.js');
var passport = require('passport');

exports.connectWunderlist = function(req, res) {
  code = req.query.code
  User.connectWunderlistAccount(code, req.user, function(err){
    if(err){
      res.render(err);
    } else {
      res.redirect('/');
    }
  });
  console.log(req.query.code);
};
