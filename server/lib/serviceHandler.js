var Wunderlist = require('./wunderlist');
var User = require('../models/user');
var Facebook = require('./facebookService');
var Twitter = require('./twitter');

var wunderlistServices = ['note_delete', 'notes_create', 'notes_read', 'notes_update', 'list_delete', 'lists_read', 'lists_create', 'lists_update'];
var facebookServices = ['facebook'];
var twitterServices = ['twitter'];
var request, serviceClass;
var serviceConf = {}

exports.setup = function(req){
  request = req;
}

exports.determineService = function(){
  var params = request.body.result.parameters
  setServiceConf(params);
}

exports.performService = function(callback){
  console.log(serviceConf);
  user = User.findOne({username: serviceConf.email}, function(err, user){
    serviceClass.performService(serviceConf, user, callback);
  });
}

function setServiceConf(params){
  console.log('setting up conf....')
  console.log(params)
  if(params['facebook'] != '' && params['facebook'] != undefined){
    setFacebookServiceConf(params)
  } else {
    if(params['twitter'] != '' && params['twitter'] != undefined){
      setTwitterServiceConf(params)
    } else {
      setWunderlistServiceConf(params);
    }
  }
}

function setFacebookServiceConf(params){
  serviceClass = Facebook;
  serviceConf = {
  email: request.body['sessionId'],
  content: params['content']
  };
}

function setTwitterServiceConf(params){
  serviceClass = Twitter;
  serviceConf = {
    email: request.body['sessionId'],
    content: params['content']
  }
}

function setWunderlistServiceConf(params){
  var conf = {
    email: request.body['sessionId']
  };
  serviceClass = Wunderlist;
  if(params['list'] != '' && params['list'] != undefined){
    conf.list = params['list'];
  } else {
    conf.list = 'DefaultBot';
  }
  conf.content = params['content'];
  conf.services = []
  for(var i = 0; i < wunderlistServices.length; i++){
    var service = wunderlistServices[i];
    if(params[service] != '' && params[service] != undefined){
      conf.services.push(service)
      conf.service = service;
    }
  }
  serviceConf = conf;
}
