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
	var rootfolder = config.get('rootfolder');
	try{
		getFolder(rootfolder, files, folders, function(){
			files.forEach( (file) => { debug(file) } );
			debug("folders:");
			folders.forEach( (folder) => { debug(folder) });
			var rootName = path.parse(rootfolder).name
			res.render('folder', { title: 'Express' , folders: folders, files: files, rootfolder: rootName });
		});
	}
	catch(err){
		next(err);
	}
});


router.get('/*', function(req, res, next) {  
	debug(req.params);
	var Folder = req.params[0];
	var files = [];
	var folders = [];
	var rootfolder = config.get('rootfolder') + Folder;
	try{
		getFolder(rootfolder, files, folders, function(){
			files.forEach( (file) => { debug(file) } );
			debug("folders:");
			folders.forEach( (folder) => { debug(folder) });
			var rootName = path.parse(rootfolder).name
			res.render('folder', { title: 'Express' , folders: folders, files: files, rootfolder: rootName });
		});
 	}
 	catch(err){
		next(err);
	}
});

module.exports = router;



function getFolder(floder, files, folders, callback){
	debug(floder);
	fs.readdir(floder, function(err, items){
		if (err)
			throw(err);
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
					throw(err);	
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


