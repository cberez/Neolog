//  Using Twitter API Client for node -- https://github.com/ttezel/twit
 
//  Twitter toolkit
//  Credits: @JvdMeulen && @j3lte
 
//
// Declarations
//
var Twit      = require('twit'),
red           = '\033[31m',
green         = '\033[32m',
yellow        = '\033[33m',
blue          = '\033[34m',
magenta       = '\033[35m',
cyan          = '\033[36m',
reset         = '\033[0m',
command       = process.argv[2],
arguments     = process.argv.splice(3),
arg           = arguments,
woeid         = 1,
DST           = 1,
aantal        = 100,
T             = new Twit({
    consumer_key: 'FuYs3eS7aAJarJSPnuX1w',
    consumer_secret: 'moyKVCG0wlPIkBFxTfA2ib1FQH8unJt1Qg7RCyJBkJ8',
    access_token: '187591030-klpnU4Rx5JTsaRZYuUqs6mD4630eBtwrCkmovb1W',
    access_token_secret: 'q0NHXXPSYTZ7klCsOnWfAp1jhROK8Lyaxks5W24SZG927'
});
 
//
// Start
//
switch(command){
  case "stream":
    check_arguments('Enter one or more keywords to filter the stream',stream(arg));
  break;
  case "search":
    check_arguments('Enter one or more keywords to search for',search(arg));
  break;
  case "lookup":
    check_arguments('Enter a screenname to lookup',lookup(arg[0]));
  break;
  case "trends":
    check_arguments('Enter a region, 1 is worldwide, 2 is Netherlands',trends(arg[0]));
  break;
  case "dump":
    check_arguments('Enter a screenname to dump',dump(arg[0]));
  break;
  default:
    console.log('Usage: node app.js <command> <arguments>');
    console.log('<command> = search / stream / lookup / trends / dump'); 
    console.log('<arguments> = additional keywords/arguments');
    process.exit(1);
}
 
function check_arguments(text,callback){
  if (arg.length < 1) {
    console.log(text); 
    process.exit(1);
  } else {
    callback;
  };  
}
 
//
// Prototype Date
//
Date.prototype.addHours= function(h){
    var copiedDate = new Date(this.getTime());
    copiedDate.setHours(copiedDate.getHours()+h);
    return copiedDate;
}
 
//
// Display
//
function processTweet(tweet){
  var type = (tweet.retweeted_status) ? 2 : 0;
    if (!type)
      type = (tweet.in_reply_to_user_id || tweet.in_reply_to_status_id) ? 1 : 0;
    view_message( { date: tweet.created_at, 
                    text: tweet.text, 
                    lang: tweet.user.lang,
                    user: tweet.user.screen_name,
                    is:   type});
}
 
function view_message(body){
  var msg     = body.text,
      time    = new Date(body.date).addHours(DST).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      color   = [magenta, yellow, red, '\033[0;31m', '\033[0;35m', '\033[0;34m', '\033[0;32m', '\033[0;36m'],
      i=0;
  for(var word in arg){
    r = new RegExp('(' + arg[word].replace(/[A-z]+:(.*)/, '$1').split(' ').join('|') + ')','ig');
    msg = msg.replace(r, reset + color[i] + '$1' + reset + cyan);
    i++;
  }
  body.user = String("                   " + green + body.user).slice(-20);
  console.log(  [yellow + time, cyan + body.lang, body.user, red + ['--','RP','RT'][body.is], cyan + msg].join( reset + ' | ') + reset); 
}
 
function show_error(err){
  errors = JSON.parse(err.data);
  console.log(errors.errors[0].message);
}
 
//
// RECURSIVE FUNCTION TO DUMP TWEETS FROM USER (UP UNTIL 3200 TWEETS)
//
function dump_recursive(scr_name,nr,max){
  if (nr >= 3200)
    return false;
  var latest = null;
  var dumpedSoFar = nr;
  T.get('statuses/user_timeline', { screen_name : scr_name, count : 200, max_id : max }, function(err, reply) {
    if (err && err.data) {
      show_error(err);return false;
    };
    dumpedSoFar += reply.length;
    for (var i=0; i < reply.length; i++) {
      latest = reply[i].id;
      processTweet(reply[i]);
    };
    if (reply.length >= 2){
      dump_recursive(scr_name,dumpedSoFar,latest);
    } else {
      console.log("Number of tweets dumped: " + dumpedSoFar);
    }
  });
}
 
//
// Main functions
//
function search(args){
  T.get('search/tweets', { q: args.join(' OR '), count: aantal }, function(err, reply) {
    if (err && err.data) {
      show_error(err);return false;
    };
    for (var i=0; i < reply.statuses.length; i++) {
      processTweet(reply.statuses[i]);
    }
  });
};
function stream(args){
  var stream1 = T.stream('statuses/filter', { track: args });
  stream1.on('tweet', function (tweet) {
    processTweet(tweet);
  }).on('limit', function (limitMessage) {
    console.log(limitMessage);
  }).on('delete', function (deleteMessage) {
    console.log(deleteMessage);
  }).on('disconnect', function (disconnectMessage) {
    console.log(disconnectMessage);
  });
};
function lookup(name){
  var scr_name = name.replace('@','');
  T.get('users/lookup', { screen_name : scr_name}, function(err, reply) {
    if (err && err.data) {
      show_error(err);return false;
    }
    console.log(reply[0]);
  });
};
function trends(id){
  var woeid = 1;
  if (id === '2')
    woeid = 23424909;
  T.get('trends/place', { id : woeid }, function(err, reply) {
    if (err){console.log(err); return false}
    console.log('trends for: '+reply[0].locations[0].name+'\r\n');
    for (var i=0; i < reply[0].trends.length; i++) {
      console.log('--> '+ reply[0].trends[i].name);
    };
  });
};
function dump(name){
  var scr_name = name.replace('@','');
  dump_recursive(scr_name,0,999999999999999999);
};