var fs = require("fs"),
path = require("path")

var getData = function(filters){
	var dataPath = __dirname + path.join('/data/users.json')

				   
	return new Promise(function(resolver,reject){
		fs.readFile(dataPath, 'utf-8', function(err,readData){
			if(err) reject(err)
			resolver(JSON.parse(readData))
		})

	})	
}


module.exports = {
	getData : getData
}