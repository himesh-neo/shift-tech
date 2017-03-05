var Twitter = require('twitter');
var UserDao = require('../dao/userDao');

var client;

exports.performService = function(serviceConf, user, callback){
  UserDao.getTwitterTokens(user._id, function(tokens){
    setupClient(tokens.access_token, tokens.token_secret)
    tweet(client, serviceConf.content, callback)
  })
}

function setupClient(access_token, access_token_secret){
  client = new Twitter({
    consumer_key: 'i5dsdrVLpDy90hvlnJg4uj2ke',
    consumer_secret: 'UhI89YHxEOzkmlLSpZ7owYcGS7Ob18M7Og2Yd0CNZwKJ64Y36H',
    access_token_key: access_token,
    access_token_secret: access_token_secret
  });
}

function tweet(client, content, callback){
  client.post('statuses/update', {status: content},  function(error, tweet, response) {
    if(error){
      callback(error);
    } else {
      resp = generateResponse('Posted tweet saying ' + tweet.text, {});
      callback(null, resp);
    }
  });
}

function generateResponse(message, data){
  return {
    speech: message,
    displayText: message,
    data: data,
    contextOut: [],
    source: 'Twitter',
    followupEvent: {}
  };
}
