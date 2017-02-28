//account model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  userid: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User'
          },
  facebookbookAccessToken : String,
  type : String,
  facebookId : String,
  expire : Date,
  createdOn : {type: Date, default: Date.now}
});

module.exports = mongoose.model('account', Account);
