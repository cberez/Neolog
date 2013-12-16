var Twit = require('twit')

var T = new Twit({
    consumer_key:         'FuYs3eS7aAJarJSPnuX1w', 
    consumer_secret:      'moyKVCG0wlPIkBFxTfA2ib1FQH8unJt1Qg7RCyJBkJ8', 
    access_token:         '187591030-klpnU4Rx5JTsaRZYuUqs6mD4630eBtwrCkmovb1W', 
    access_token_secret:  'q0NHXXPSYTZ7klCsOnWfAp1jhROK8Lyaxks5W24SZG927'
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