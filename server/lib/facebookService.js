var FB = require('fb');
var UserDao = require('../dao/userDao');

module.exports = {

  performService: function(serviceConf, user, callback){

    UserDao.getFbToken(user._id, function(token){
      FB.setAccessToken(token);
      FB.api('me/feed', 'post', { message: serviceConf.content }, function (response) {
        if(!response || response.error) {
          console.log(response.error);
          callback(response.error)
        }else{
          resp = generateResponse('You have successfully posted your status on facebook', response.id);
          callback(null, resp);
        }
      });
    });

  }
}

function generateResponse(message, data){
  return {
    speech: message,
    displayText: message,
    data: data,
    contextOut: '',
    source: 'facebook'
  };
}
