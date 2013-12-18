var fs = require('fs');

module.exports = {

	clearTweet: function(tweet, callback){
	  var infos = JSON.stringify({
	    timestamp: tweet.created_at,
	    type: "twitter",
	    text: tweet.text,
	    pseudo: tweet.user.screen_name,
	    location: tweet.user.location
	  });

	  callback(infos);
	},

	writeToFile: function(infos, file, dir, dirPath){
	  fs.writeFile(dirPath + '/dir_' + dir + '/file_' + file, infos, function(err){
	    if(err) throw err;
	    console.log('Tweet ' + file + ' witten');
	  });
	},

	newDir: function(dir, path){
	  console.log('Creating dir_' + dir);
	  fs.mkdirSync(path + '/dir_' + dir, 0755, null);
	}
}