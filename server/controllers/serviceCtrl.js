var ServiceHandler = require('../lib/serviceHandler')

exports.perform = function(req, res){
  ServiceHandler.setup(req);
  ServiceHandler.determineService();
  ServiceHandler.performService(function(respContent){
    console.log(respContent);
    res.send(respContent);
  });
  // res.status(200);
}
