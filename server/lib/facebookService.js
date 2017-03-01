var FB = require('fb');
var Q = require('q');


var getWunderlistToken = function(access_token, content){

  FB.setAccessToken(access_token);
  FB.api('me/feed', 'post', { message: body }, function (response) {
    if(!response || response.error) {
      deferred.reject(response.error);
    }else{
      deferred.resolve(response.id);
    }
  });
}
