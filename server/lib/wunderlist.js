var request = require('request');

// var accessToken;
var clientId = '9c6bff44918999297f94';
var basePath = 'http://a.wunderlist.com/api/v1'
var clientSecret = '96f36e3908bb91ee981b7de3b581a8295113c3124bfed0d89ac59081b40b'
var headers;


// function Wunderlist(){}
module.exports = {

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

function getLists(){
  endPoint = '/lists';
  makeRequest(endPoint, 'GET', {});
}

function getListDetails(listId){
  endPoint = '/lists/' + listId;
  makeRequest(endPoint, 'GET', {});
}

function createList(title){
  endPoint = '/lists';
  makeRequest(endPoint, 'POST', {"title": title})
}

function updateList(listId, title){
  endPoint = '/lists/' + listId;
  // To Be Implemented
  revision = WunderList.fetchRevision(listId);
  makeRequest(endPoint, 'PATCH', {"title": title, "revision": revision})
}

function deleteList(listId){
  revision =  WunderList.fetchRevision(listId);
  endPoint = '/lists/' + listId + "?revision=" + revision;
  makeRequest(endPoint, 'DELETE', {});
}

function getTasks(listId, status){
  endPoint = '/tasks?list_id=' + listId;
  if(status != undefined){
    endPoint = endPoint + '&completed=' + status;
  }
  makeRequest(endPoint, 'GET', {});
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
  endPoint = '/tasks'
  data = {
    "list_id": listId,
    "title": title
  }
  makeRequest(endPoint, 'POST', data);
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

function  deleteTask(taskId){
  revision = WunderTask.getRevision(taskId);
  endPoint = '/tasks/' + taskId + '?revision=' + revision;
  makeRequest(endPoint, 'DELETE', {});
}

function makeRequest(endPoint, method, data){
  console.log(endPoint)
  url = basePath + endPoint
  options = {
    "url": url,
    "headers": headers,
    "method": method,
    "body": JSON.stringify(data)
  }
  request(options, function(err, resp, body){
    console.log(body);
  })
}

// setup('4a3aa13ec372ce74d677e98a2eb381ffbddc4cf57a94602407d938207e6d');
