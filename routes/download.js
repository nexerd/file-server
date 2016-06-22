var express = require('express');
var router = express.Router();
var debug = require("../debug")("file-server:download");
var fs = require('fs');
var path = require("path");

/* GET users listing. */
router.get('/*', function(req, res, next) {	
	var filename = req.params[0];
	filename = path.normalize(filename);
	try{
		fs.createReadStream(filename).pipe(res);
		debug("Send file " + filename);
	}
	catch(err){
		next(err);
	}
});

module.exports = router;
