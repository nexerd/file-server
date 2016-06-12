var express = require('express');
var router = express.Router();
var debug = require("../debug")("file-server:upload");
var fs = require('fs');
var config = require('../config');
var async = require("async");
var path = require("path");

/* GET users listing. */
router.post('/*', function(req, res, next) {
	debug(req.params);
	var rootfolder = config.get('rootfolder');
	var filename = req.params[0];
	filename = path.join(rootfolder, filename);
	debug(filename);
	req.pipe(fs.createWriteStream(filename));

	req.on('data', (chunk) => { debug('Get chunk of file'); });
	req.on('end', () => { debug('File upload!'); res.send('OK'); });
	req.on('error', (err) => { debug('Error!'); res.status(503).send(err); next(err); });
});

module.exports = router;
