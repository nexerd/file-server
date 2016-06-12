var express = require('express');
var router = express.Router();
var debug = require("../debug")("file-server:download");
var fs = require('fs');
var async = require("async");
var path = require("path");

/* GET users listing. */
router.get('/*', function(req, res, next) {
	debug(req.params);
	var filename = req.params[0];
	filename = path.normalize(filename);
	fs.createReadStream(filename).pipe(res);
});

module.exports = router;
