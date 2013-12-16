var Twit = require('twit')

var T = new Twit({
    consumer_key:         '...', 
    consumer_secret:      '...', 
    access_token:         '...', 
    access_token_secret:  '...'
})

module.exports = {

	searchTweets: function(word, date, numberOfTweets, callback){
		T.get(
			'search/tweets', 
			{ 
				//q: word + ' since:' + date, 
				q: word + ' since:' + date,
				count: numberOfTweets
			}, 
			function(err, reply) {
				if(err) console.log(err);
				else {
					return callback(reply)
				}
		});

		return callback(null);
	}
}