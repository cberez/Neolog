Neolog Crawler
==============

Simple twitter crawler that gets and saves the tweets written in french from the public stream  

To Use
------
Fill the twitter app data in the crawler file :  
```
var T = new Twit({
  consumer_key:         '',  
  consumer_secret:      '',  
  access_token:         '',  
  access_token_secret:  '' 
});
```  
And use `node crawler.js`, the crawler will do the rest

Data format
-----------
The crawler creates an `input` directory at the root of the *Neolog* project and saves the data inside.  
Every 100 tweet, a new directory is created with the naming convention *dir_X* with *X* being a number.  
In each directory, one file corresponds to one tweet. Files are named with the same convention : *file_X* with *X* being a number.  
The saved data looks like this :  
```  
{  
  timestamp: " ",  
  type: "twitter",  
  text: " ",  
  pseudo: " ",  
  age: 0,  
  location: " "  
}
```

Dev
---
The crawler uses the following modules :  

* [twit](https://github.com/ttezel/twit) : [@ttezel](https://github.com/ttezel)'s twitter API Client for node
* [fs](http://nodejs.org/api/fs.html) : node's File System module

