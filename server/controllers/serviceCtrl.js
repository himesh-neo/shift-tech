var ServiceHandler = require('../lib/serviceHandler')

exports.perform = function(req, res){
  ServiceHandler.setup(req);
  ServiceHandler.determineService();
  // ServiceHandler.performService(function(err, respContent){
  //   if(err){
  //     console.log(err);
  //     res.send({error: err});
  //   } else {
  //     console.log('rendering........')
  //     res.send(respContent);
  //   }
  // });
  ServiceHandler.performService().then(function(resp){
    console.log('executed...!!!')
    console.log(resp);
  }).catch(function (err){
    console.log('error aaya.....')
  })
}
