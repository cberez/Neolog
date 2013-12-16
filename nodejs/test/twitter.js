var assert = require('chai').assert;
var twitter = require('../routes/twitter');

suite('Twitter', function() {
    test("searchTweets", function() {
    	twitter.searchTweets('hey', '2013-12-10', 3, function(tweets){
			assert.isNotNull(tweets);
		});
    })
})