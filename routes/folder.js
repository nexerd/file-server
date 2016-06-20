var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('../config');
var async = require("async");
var path = require("path");
var debug = require("../debug")("file-server:folder");

router.get('/', function(req, res, next) {  	
	var files = [];
	var folders = [];
	var rootfolder = path.normalize(config.get('rootfolder'));
	getFolder(rootfolder, files, folders, () => {
		debug("Get " + rootfolder);
		var rootName = path.parse(rootfolder).name
		res.render('folder', { title: 'File server' , folders: folders, files: files, rootfolder: rootName });
	},
	next);
});


router.get('/*', function(req, res, next) {  
	//debug(req.params);
	var Folder = req.params[0];
	var files = [];
	var folders = [];
	var lookfolder = path.normalize(config.get('rootfolder') + '/' + Folder);
	getFolder(lookfolder, files, folders, () => {
		debug("Get " + lookfolder);
		var rootName = path.parse(lookfolder).name
		res.render('folder', { 	title: 'File server',
			folders: folders,
			files: files,
			rootfolder: rootName 
		});
	},
	next);
});

module.exports = router;



function getFolder(floder, files, folders, callback, nextMiddleWare){
	//debug(floder);
	fs.readdir(floder, function(err, items){
		if (err){
			nextMiddleWare(err);
			return;
		}
		var itemsNames = [];		
		var name;
		//debug("items: ");
		for (var i=0; i<items.length; i++){	
			name = path.normalize(floder + '/' + items[i]);
			itemsNames.push(name);
			//debug(name);
		};		
		async.map(itemsNames, getStat, callback);

		function getStat(fileName, next){
			//debug("getStat(" + fileName + ")");
			fs.stat(fileName, function(err, stats){
				if (err){
					nextMiddleWare(err);	
					return;
				}
				else{
					if (stats.isDirectory()){
						folders.push(path.parse(fileName).name);
					}
					else{
						files.push( 
							{ 
								name: path.parse(fileName).name, 
								fullname: fileName
							});
					};
				};
				//debug("files length: " + files.length);
				//debug("folders length: " + folders.length);
				next();
			});			
		};
	}); 	
};


