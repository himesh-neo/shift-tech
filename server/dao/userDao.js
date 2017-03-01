var User = require('../models/user.js');
var UserAccount = require('../models/account.js');
var Q = require('q');



var getUser = function(userid){
   var deferred = Q.defer()
    User.findOne({ '_id': userid }, function (err, userDetails) {
     if (err){
       deferred.reject(err);
     }else{
       deferred.resolve(userDetails);
     }
   });
 return deferred.promise;
};

var getFbToken = function(userid){
  var deferred = Q.defer()
   UserAccount.findOne({ 'userid': userid, type:'facebook' }, function (err, userFbToken) {
    if (err){
      deferred.reject(err);
    }else{
      var token = userFbToken.accessToken;
      deferred.resolve({fbAccessToken : token});
    }
  });
 return deferred.promise;
}

var getTwitterToken = function(userid){
  var deferred = Q.defer()
   UserAccount.findOne({ 'userid': userid, type:'twitter' }, function (err, userTwitterToken) {
    if (err){
      deferred.reject(err);
    }else{
      var token = userTwitterToken.accessToken;
      deferred.resolve({twitterAccessToken : token});
    }
  });
 return deferred.promise;
}

var getWunderlistToken = function(userid){
  var deferred = Q.defer()
   UserAccount.findOne({ 'userid': userid, type:'wunderlist' }, function (err, userwlToken) {
    if (err){
      deferred.reject(err);
    }else{
      var token = userwlToken.accessToken;
      deferred.resolve({wunderlistAccessToken : token});
    }
  });
 return deferred.promise;
}

module.exports = {
  getUser : getUser,
  getFbToken : getFbToken
};
