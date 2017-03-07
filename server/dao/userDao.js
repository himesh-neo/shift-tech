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

var getFbToken = function(userid, callback){
  //var deferred = Q.defer()
   UserAccount.findOne({ 'userid': userid, type:'facebook' }, function (err, userFbToken) {
    if (err){
      callback(err);
    //  deferred.reject(err);
    }else{
      var token = userFbToken.accessToken;
      callback(token);
    //  deferred.resolve({fbAccessToken : token});
    }
  });
 //return deferred.promise;
}

// var getTwitterTokens = function(userid, callback){
//    UserAccount.findOne({ 'userid': userid, type:'Twitter' }, function (err, userTwitterToken) {
//     if (err){
//       callback(err)
//     }else{
//       var tokens ={
//         access_token: userTwitterToken.accessToken,
//         token_secret: userTwitterToken.profile.tokenSecret
//       };
//       callback(tokens);
//     }
//   });
// }

var getTwitterTokens = function(userId){
  var deferred = Q.defer()
  UserAccount.findOne({'userid': userId, type: 'Twitter'}, function(err, userTwitterToken){
    if(err) deferred.reject(err);
    else {
      var tokens = {
        access_token: userTwitterToken.accessToken,
        token_secret: userTwitterToken.profile.tokenSecret
      };
      deferred.resolve(tokens)
    }
  })
  return deferred.promise;
}

var getWunderlistToken = function(userid, callback){
  var deferred = Q.defer()
   UserAccount.findOne({ 'userid': userid, type:'Wunderlist' }, function (err, userwlToken) {
    if (err) deferred.reject(err)
    else{
      var token = userwlToken.accessToken;
      deferred.resolve(token);
    }
  });
 return deferred.promise;
}

module.exports = {
  getUser : getUser,
  getFbToken : getFbToken,
  getWunderlistToken : getWunderlistToken,
  getTwitterTokens : getTwitterTokens
};
