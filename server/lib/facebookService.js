var FB = require('fb');


module.exports = {

  performService: function(serviceConf, user, callback){

    FB.setAccessToken(access_token);
    FB.api('me/feed', 'post', { message: body }, function (response) {
      if(!response || response.error) {
        deferred.reject(response.error);
      }else{
        deferred.resolve(response.id);
      }
    });
  }

}
