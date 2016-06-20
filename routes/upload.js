var express = require('express');
var router = express.Router();
var debug = require("../debug")("file-server:upload");
var fs = require('fs');
var config = require('../config');
var async = require("async");
var path = require("path");

/* GET users listing. */
router.post('/*', function(req, res, next) {	
	var rootfolder = config.get('rootfolder');
	var filename = req.params[0];
	try{
		filename = path.join(rootfolder, filename);		
		req.pipe(fs.createWriteStream(filename));
		debug('Start upload file ' + filename);
	}
	catch(err){
		next(err);
	}

	//req.on('data', (chunk) => { debug('Get chunk of file'); });

	req.on('end', () => { 
		var addr = req.params[0].split('/');
		addr.pop();
		var url = '/';
		addr.forEach( (part) => {
			url += part + '/';
		});
		url = path.normalize(url);
		debug('File upload!');
		res.redirect(url);
	});

	req.on('error', (err) => { 
		next(err); 
	});
});

module.exports = router;
