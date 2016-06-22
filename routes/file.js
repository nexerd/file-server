var express = require('express');
var router = express.Router();
var debug = require("../debug")("file-server:file");
var fs = require('fs');
var async = require("async");
var path = require("path");

router.post('/rename', function(req, res, next) {
	var name = req.body.name;
	var file = path.normalize(req.body.file);		
	var newFile = "";	
	var addr = file.split('\\');
	var oldname = addr.pop();
	for(var i = 0;  i < addr.length; i++)
		newFile += addr[i] + '/';
	var url = newFile;
	newFile = path.join(newFile, name);	
	fs.rename(file, newFile, (err) => {
		if (err){
			next(err);
			return;
		}
		debug(oldname + ' change on ' + name);
		res.redirect(url);
	});
});

router.delete('/delete', function(req, res, next) {
	var file = path.normalize(req.body.file);
	var addr = file.split('\\');
	fs.unlink(file, (err) => {
		if (err){
			next(err);
			return;
		}
		debug('Delete ' + file);
		var url = "";
		addr.pop();
		for(var i = 0;  i < addr.length; i++)
			url += addr[i] + '/';	
		res.redirect(url);
	});
});

module.exports = router;
