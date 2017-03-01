var Wunderlist = require('./wunderlist');
var User = require('../models/user')

var wunderlistServices = ['note_delete', 'notes_create', 'notes_read', 'notes_update', 'list_delete', 'lists_read', 'lists_create', 'lists_update'];
var facebookServices = ['facebook'];
var twitterServices = ['twitter'];
var request, serviceDetails, response, serviceClass;
var serviceConf = {}

exports.setup = function(req){
  request = req;
  response = {};
}

exports.determineService = function(){
  var params = request.body.result.parameters
  setServiceConf(params);
}

exports.performService = function(callback){
  user = User.findById(serviceConf.userId, function(err, user){
    serviceClass.performService(serviceConf, user, callback);
  });
}

function setServiceConf(params){
  if(params['facebook'] != '' && params['facebook'] != undefined){
    setFacebookServiceConf(params)
  } else {
    if(params['twitter'] != '' && params['twitter'] != undefined){
      setFacebookServiceConf(params)
    } else {
      setWunderlistServiceConf(params);
    }
  }
}

function setWunderlistServiceConf(params){
  var conf = {
    userId: request.headers['userId']
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
    console.log(wunderlistServices[i])
    var service = wunderlistServices[i];
    if(params[service] != '' && params[service] != undefined){
      conf.services.push(service)
      conf.service = service;
    }
  }
  serviceConf = conf;
  console.log(serviceConf);
}
