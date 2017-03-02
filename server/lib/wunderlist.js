var request = require('request');
var UserDao = require('../dao/userDao');
// var accessToken;
var clientId = '639e76137806e752a65c';
var basePath = 'http://a.wunderlist.com/api/v1'
var clientSecret = '29883eb23f0f09dd3a225743480b235121b3a689f64c1ffebf92dec4b82c'
var headers;

module.exports = {

  performService: function(serviceConf, user, callback){
    console.log(user);
    UserDao.getWunderlistToken(user._id, function(token){
      serviceConf.access_token = token;
      setup(serviceConf.access_token);
      findOrCreateList(serviceConf.list, function(listId){
        serviceConf.listId = listId;
        switch(serviceConf.service){
          case 'notes_create':
            createTask(serviceConf.listId, serviceConf.content, function(task){
              if(task != undefined){
                resp = generateResponse('Added task ' + task.title, task);
                callback(resp);
              }
            })
            break;
          case 'notes_read':
            getTasks(serviceConf.listId, false, function(tasks){
              if(tasks != undefined){
                t = []
                for(var i = 0; i < tasks.length; i++){
                  t.push(tasks[i].title);
                }
                resp = generateResponse('You have  ' + t.join(', ') + 'on your list', tasks);
                callback(resp);
              }
            })
            break;
          case 'note_delete':
            getTasks(serviceConf.listId, false, function(tasks){
              if(tasks != undefined){
                var taskId, revision;
                for(var i = 0; i < tasks.length; i++){
                  if(tasks[i].title == serviceConf.content){
                    taskId = tasks[i].id;
                    revision = tasks[i].revision;
                  }
                }
                deleteTask(taskId, revision, function(resp){
                  console.log(resp)
                  resp = generateResponse('Deleted Task ' + serviceConf.content, {});
                  callback(resp);
                })
              }
            })
            break;
        }
      })
    })
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
      callback(JSON.parse(body).access_token);
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
  makeRequest(endPoint, 'GET', {}, callback);
}

function getListDetails(listId){
  endPoint = '/lists/' + listId;
  makeRequest(endPoint, 'GET', {});
}

function createList(title, callback){
  endPoint = '/lists';
  makeRequest(endPoint, 'POST', {"title": title}, callback);
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

function createTask(listId, title, callback){
  endPoint = '/tasks'
  data = {
    "list_id": listId,
    "title": title
  }
  makeRequest(endPoint, 'POST', data, callback);
}

//Note - passing list id here will move task to the given list
function  updateTask(taskId, title, listId){
  endPoint = '/tasks/' + taskId;
  revision = WunderTask.getRevision(taskId);
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
  getLists(function(lists){
    for(var i = 0; i < lists.length; i ++){
      if(lists[i].title == listName){
        listId = lists[i].id;
      }
    }
    if(listId != undefined){
      callback(listId);
    } else {
      createList(listName, function(list){
        callback(list.id);
      })
    }
  })
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

function makeRequest(endPoint, method, data, callback){
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
      callback({message: 'Delete successful'})
    } else {
      callback(JSON.parse(body));
    }
  })
}

// setup('4a3aa13ec372ce74d677e98a2eb381ffbddc4cf57a94602407d938207e6d');
