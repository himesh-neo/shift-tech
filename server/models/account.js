//account model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  accessToken : String,
  type : String,
  createdOn : {
    type: Date, default: Date.now
  },
  profile:Object
});

module.exports = mongoose.model('account', Account);
