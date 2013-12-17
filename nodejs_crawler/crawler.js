var Twit      = require('twit');
var T         = new Twit({
		              consumer_key:         '', 
		              consumer_secret:      '', 
		              access_token:         '', 
		              access_token_secret:  ''
		        		});
var fs        = require('fs');

var dir = 0;
var file = 0;

fs.mkdir('./../input');
newDir(0, null);

var stream = T.stream('statuses/sample', { language: 'fr' });
stream.on('tweet', function(tweet){
  clearTweet(tweet, function(infos){
    if(file < 100){
      file++;
      writeToFile(infos, file, dir);
    }
    else {
      dir++;
      file = 1;
      newDir(dir);
      writeToFile(infos, file, dir)
    }
  });
});

function clearTweet(tweet, callback){
  var infos = JSON.stringify({
    timestamp: tweet.created_at,
    type: "twitter",
    text: tweet.text,
    pseudo: tweet.user.screen_name,
    location: tweet.user.location
  });

  callback(infos);
}

function writeToFile(infos, file, dir){
  fs.writeFile('./../input/dir_' + dir + '/file_' + file, infos, function(err){
    if(err) throw err;
    console.log('Tweet ' + file + ' witten');
  });
}

function newDir(dir){
  console.log('Creating dir_' + dir);
  fs.mkdirSync('./../input/dir_' + dir, 0755, null);
}