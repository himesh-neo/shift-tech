var ServiceHandler = require('../lib/serviceHandler')

exports.perform = function(req, res){
  ServiceHandler.setup(req);
  ServiceHandler.determineService();
  ServiceHandler.performService(function(err, respContent){
    if(err){
      console.log(err);
      res.send({error: err});
    } else {
      res.send(respContent);
    }
  });
}
