var request = require('request');
var UserDao = require('../dao/userDao');
var Q = require('q');
// var accessToken;
var clientId = '639e76137806e752a65c';
var basePath = 'http://a.wunderlist.com/api/v1'
var clientSecret = '29883eb23f0f09dd3a225743480b235121b3a689f64c1ffebf92dec4b82c'
var headers;

module.exports = {

  performService: function(serviceConf, user){
    deferred = Q.defer()
    UserDao.getWunderlistToken(user._id).then(function(token){

      setup(token);
      findOrCreateList(serviceConf.list).then(function(listId){
        console.log('list found...!!!')
          serviceConf.listId = listId;
          performSelectedService(serviceConf).then(function(resp){
            deferred.resolve(resp)
          })
      })
    })
    return deferred.promise
  },

  fetchToken: function(code, callback){
    url = 'https://www.wunderlist.com/oauth/access_token'
    data = {"client_id": clientId, "client_secret": clientSecret, "code": code}
    options = {
      url: url,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
      method: 'POST'
    }
    request(options, function(err, resp, body){
      callback(err, JSON.parse(body).access_token);
    })
  }

}

function setup(token){
  headers = {
    "Content-Type": "application/json",
    "X-Access-Token": token,
    "X-Client-Id": clientId
  }
}

function getLists(callback){
  endPoint = '/lists';
  return makeRequest(endPoint, 'GET', {}, callback);
}

function getListDetails(listId){
  endPoint = '/lists/' + listId;
  makeRequest(endPoint, 'GET', {});
}

function createList(title){
  endPoint = '/lists';
  makeRequest(endPoint, 'POST', {"title": title});
}

function updateList(listId, title, revision){
  endPoint = '/lists/' + listId;
  // To Be Implemented
  // revision = WunderList.fetchRevision(listId);
  makeRequest(endPoint, 'PATCH', {"title": title, "revision": revision})
}

function deleteList(listId){
  revision =  WunderList.fetchRevision(listId);
  endPoint = '/lists/' + listId + "?revision=" + revision;
  makeRequest(endPoint, 'DELETE', {});
}

function getTasks(listId, status, callback){
  endPoint = '/tasks?list_id=' + listId;
  if(status != undefined){
    endPoint = endPoint + '&completed=' + status;
  }
  makeRequest(endPoint, 'GET', {}, callback);
}

function getCompletedTasks(listId){
  getTasks(listId, true);
}

function getIncompleteTasks(listId){
  getTasks(listId, false)
}

function getTaskDetails(taskId){
  endPoint = '/tasks/' + taskId;
  makeRequest(endPoint, 'GET', {});
}

function createTask(listId, title){
  console.log('creating task....!!!')
  endPoint = '/tasks'
  data = {
    "list_id": listId,
    "title": title
  }
  return makeRequest(endPoint, 'POST', data);
}

//Note - passing list id here will move task to the given list
function  updateTask(taskId, title, listId){
  endPoint = '/tasks/' + taskId;
  revision = WuenderTask.getRevision(taskId);
  data = {
    "title": title,
    "revision": revision
  }
  if(listId != undefined){
    data.list_id = listId
  }
  makeRequest(endPoint, 'PATCH', data);
}

function  deleteTask(taskId, revision, callback){
  endPoint = '/tasks/' + taskId + '?revision=' + revision;
  makeRequest(endPoint, 'DELETE', {}, callback);
}

function findOrCreateList(listName, callback){
  var listId;
  var deferred = Q.defer()
  getLists().then(function(lists){
    for(var i = 0; i < lists.length; i ++){
      if(lists[i].title == listName){
        listId = lists[i].id;
      }
    }
    if(listId != undefined){
      deferred.resolve(listId);
    } else {
      createList(listName).then(function(list){
        console.log('created list');
        deferred.resolve(list.id);
      })
    }
  
  })
  return deferred.promise;
}

function notesCreateOrUpdate(serviceConf){
  var deferred = Q.defer()
  createTask(serviceConf.listId, serviceConf.content).
    then(function(task){
      if(task != undefined){
        console.log('resolving this.....')
        resp = generateResponse('Added task ' + task.title, task);
        deferred.resolve(resp);
        return resp;
      }
    })
    return deferred.promise;
}

function notesRead(serviceConf, callback){
  getTasks(serviceConf.listId, false, function(err, tasks){
    if(err){
      callback(err);
    } else {
      if(tasks != undefined){
        t = []
        for(var i = 0; i < tasks.length; i++){
          t.push(tasks[i].title);
        }
        resp = generateResponse('You have  ' + t.join(', ') + 'on your list', tasks);
        callback(resp);
      }

    }
  })
}

function notesDelete(serviceConf, callback){
  getTasks(serviceConf.listId, false, function(err, tasks){
    if(err){
      callback(err);
    } else {
      if(tasks != undefined){
        var taskId, revision;
        for(var i = 0; i < tasks.length; i++){
          if(tasks[i].title == serviceConf.content){
            taskId = tasks[i].id;
            revision = tasks[i].revision;
          }
        }
        deleteTask(taskId, revision, function(err, resp){
          if(err){
            callback(err);
          } else {
            console.log(resp)
            resp = generateResponse('Deleted Task ' + serviceConf.content, {});
            callback(null, resp);
          }
        })
      }
    }
  });
}

function performSelectedService(serviceConf){
  switch(serviceConf.service){
    case 'notes_create':
    case 'notes_update':
      return notesCreateOrUpdate(serviceConf);
      break;
    case 'notes_read':
      notesRead(serviceConf, callback);
      break;
    case 'note_delete':
      notesDelete(serviceConf, callback)
      break;
  }
}

function generateResponse(message, data){
  console.log('hello thjere./.......')
  return {
    speech: message,
    displayText: message,
    data: data,
    contextOut: [],
    source: 'Wunderlist',
    followupEvent: {}
  };
}

function makeRequest(endPoint, method, data){
  var deferred = Q.defer()
  console.log(endPoint)
  url = basePath + endPoint
  options = {
    "url": url,
    "headers": headers,
    "method": method,
    "body": JSON.stringify(data)
  }
  request(options, function(err, resp, body){
    if(method == 'DELETE' && resp.statusCode == 204){
      deferred.resolve({message: 'Delete successful'})
    } else {
      respBody = JSON.parse(body)
      console.log(respBody);
      if(err || respBody["unauthorized"]){
        deferred.reject(respBody);
      } else {
        deferred.resolve(JSON.parse(body));

      }
    }
  })
  return deferred.promise;
}

