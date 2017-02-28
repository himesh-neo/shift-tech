//account model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  userid: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User'
          },
  token : String,
  type : String,
  expire : Date,
  createdOn : Date
});

module.exports = mongoose.model('account', Account);
