var express = require('express');
var router = express.Router();

var ServiceController = require('../controllers/serviceCtrl')

router.post('/performJob', ServiceController.perform);

module.exports = router;
