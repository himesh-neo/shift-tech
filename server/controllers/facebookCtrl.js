var FB = require('fb');

exports.postOnFacebook = function(req, res) {
  UserDao.getFbToken(user._id).then(function(reslt){

    res.status(200).json({
      message: 'Posted succesfully!!'
    });
  });



};
