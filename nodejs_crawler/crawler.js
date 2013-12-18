var Twit      = require('twit');
var T         = new Twit({
		              consumer_key:         '', 
		              consumer_secret:      '', 
		              access_token:         '', 
		              access_token_secret:  ''
		        		});
var fs        = require('fs');
var utils     = require('./src/utils')

var dir = 0;
var file = 0;

var dirPath = './../input';

fs.mkdir(dirPath);
utils.newDir(0, dirPath);

var stream = T.stream('statuses/sample', { language: 'fr' });
stream.on('tweet', function(tweet){
  utils.clearTweet(tweet, function(infos){
    if(file < 100){
      file++;
      utils.writeToFile(infos, file, dir, dirPath);
    }
    else {
      dir++;
      file = 1;
      utils.newDir(dir, dirPath);
      utils.writeToFile(infos, file, dir, dirPath)
    }
  });
});