var Wunderlist = require('./wunderlist');
var User = require('../models/user');
var Facebook = require('./facebookService');
var Twitter = require('./twitter');
var Q = require('q');

var wunderlistServices = ['note_delete', 'notes_create', 'notes_read', 'notes_update', 'list_delete', 'lists_read', 'lists_create', 'lists_update'];
var facebookServices = ['facebook'];
var twitterServices = ['twitter'];
var request, serviceClass;
var serviceConf = {}

exports.setup = function(req){
  request = req;
  console.log('setyup....')
}

exports.determineService = function(){
  var params = request.body.result.parameters
  setServiceConf(params);
  console.log('datermine service....')
}

exports.performService = function(){
  console.log(serviceConf);
  deferred = Q.defer()
  user = User.findOne({username: serviceConf.email}, function(err, user){
    if(err){
      deferred.reject(err);
    } else{
      if(!user){
        var errMessage = 'User not found';
        deferred.reject(errMessage);
      }else{
        serviceClass.performService(serviceConf, user).then(function(resp){
          console.log('this is response to endpoint.....')
          console.log(resp)
          deferred.resolve( resp );
        })
      }
    }
  });
  return deferred.promise;
}

function setServiceConf(params){
  console.log('setting up conf....')
  console.log(params)
  if(params['facebook'] != undefined){
    setFacebookServiceConf(params)
  }
  if(params['twitter'] != undefined){
    setTwitterServiceConf(params)
  }
  if(params['list'] != undefined){
    setWunderlistServiceConf(params);
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
  console.log('this is the conf.....');
  console.log(conf);
  serviceConf = conf;
}
