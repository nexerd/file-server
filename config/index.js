var path = require("path");
var nconf = require('nconf');

process.env.DEBUG = 'file-server:*';

var debug = require('../debug')('file-server:nconf')

nconf.argv()
	.env()
	.file({ file: path.join(__dirname, '/config.json')});

nconf.set("address:port", nconf.get("hostPort"));
nconf.set("address:host", nconf.get('hostAddr'));
nconf.set("rootfolder", path.normalize("D:/share_folder"));

debug(nconf.get('address'));
debug(nconf.get('rootfolder'));
debug(nconf.get('DEBUG'));

module.exports = nconf;