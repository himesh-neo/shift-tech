var request = require('request');
var UserDao = require('../dao/userDao');
// var accessToken;
var clientId = '9c6bff44918999297f94';
var basePath = 'http://a.wunderlist.com/api/v1'
var clientSecret = '96f36e3908bb91ee981b7de3b581a8295113c3124bfed0d89ac59081b40b'
var headers;

module.exports = {

  performService: function(serviceConf, user, callback){
    UserDao.getWunderlistToken(user._id, function(token){
      serviceConf.access_token = token;
      setup(serviceConf.access_token);
      findOrCreateList(serviceConf.list, function(err, listId){
        if(err){
          callback(err)
        } else {
          serviceConf.listId = listId;
          switch(serviceConf.service){
            case 'notes_create':
            case 'notes_update':
              createTask(serviceConf.listId, serviceConf.content, function(err, task){
                if(err){
                  callback(err)
                } else {
                  if(task != undefined){
                    resp = generateResponse('Added task ' + task.title, task);
                    callback(resp);
                  }
                }
              })
              break;
            case 'notes_read':
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
              break;
            case 'note_delete':
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
              })
              break;
          }
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
  console.log('creating task....!!!')
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
  getLists(function(err, lists){
    if(err){
      callback(err);
    } else {
      for(var i = 0; i < lists.length; i ++){
        if(lists[i].title == listName){
          listId = lists[i].id;
        }
      }
      if(listId != undefined){
        callback(null, listId);
      } else {
        createList(listName, function(err, list){
          if(err){
            callback(err);
          } else {
            console.log('created list');
            callback(null, list.id);
          }
        })
      }
    }
  })
}

function generateResponse(message, data){
  return {
    speech: message,
    displayText: message,
    data: data,
    contextOut: [],
    source: 'Wunderlist',
    followupEvent: {}
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
      callback(null, {message: 'Delete successful'})
    } else {
      respBody = JSON.parse(body)
      console.log(respBody);
      if(err || respBody["unauthorized"]){
        callback(respBody);
      } else {
        callback(null, JSON.parse(body));

      }
    }
  })
}

// setup('4a3aa13ec372ce74d677e98a2eb381ffbddc4cf57a94602407d938207e6d');
