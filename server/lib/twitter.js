var Twitter = require('twitter');
var UserDao = require('../dao/userDao');

var client = new Twitter({
  consumer_key: 'i5dsdrVLpDy90hvlnJg4uj2ke',
  consumer_secret: 'UhI89YHxEOzkmlLSpZ7owYcGS7Ob18M7Og2Yd0CNZwKJ64Y36H'
});

exports.performService = function(serviceConf, user, callback){
  UserDao.getTwitterTokens(user._id, function(tokens){
    client.access_token_secret = tokens.access_token;
    client.access_token_secret = tokens.token_secret
    tweet(client, serviceConf.content, callback)
  })
}

function tweet(client, content, callback){
  console.log(client);
  client.post('statuses/update', {status: content},  function(error, tweet, response) {
    if(error){
      console.log(error);
    }
    resp = generateResponse('Posted tweet saying ' + tweet.text, {});
    callback(resp)
    // console.log(tweet);  // Tweet body.
    // console.log(response);  // Raw response object.
  });
}

function generateResponse(message, data){
  return {
    speech: message,
    displayText: message,
    data: data,
    contextOut: '',
    source: 'Wunderlist'
  };
}
