var Twit      = require('twit');
var T         = new Twit({
		              consumer_key:         'FuYs3eS7aAJarJSPnuX1w', 
		              consumer_secret:      'moyKVCG0wlPIkBFxTfA2ib1FQH8unJt1Qg7RCyJBkJ8', 
		              access_token:         '187591030-klpnU4Rx5JTsaRZYuUqs6mD4630eBtwrCkmovb1W', 
		              access_token_secret:  'q0NHXXPSYTZ7klCsOnWfAp1jhROK8Lyaxks5W24SZG927'
		        		});
var command   = process.argv[2];
var args 			= process.argv.splice(3);
var twitter 	= require('./routes/twitter');

switch(command){
  case 'search' :
  		checkArguments('Enter a word to look for, a date to look up since and a number of tweets to get', 
  			search(args[0], args[1], args[2]));
    break;

  default: 
  case 'help' : 
    console.log('\n\nNeolog twitter crawler');
    console.log('----------------------\n');
    console.log('Usage: node app.js \t<command>\t<arguments>')
    console.log('\t\t\tsearch\t\tword date numberOfTweets');
    console.log('\n\n');
    process.exit(0);
}

function checkArguments(text, callback){
	if(arguments.length < 1){
		console.log(text);
		process.exit(1);
	}
	else callback()
}


function search(word, date, numberOfTweets){
  T.get(
    'search/tweets', 
    {
      q: word + ' since:' + date,
      count: numberOfTweets
    }, 
    function(reply) {
      if(err) console.log(err);
      else {
        console.log(reply);
        process.exit();
      }
  });
	process.exit(1);
}
// app.get('/users', user.list);
// app.get('/tweets/:word/:date/:count', function(req){
//  twitter.searchTweets(req.params.word, req.params.date, req.params.count, function(tweets){
//    console.log(tweets);
//  });
// })