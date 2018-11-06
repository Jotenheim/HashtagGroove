const fs = require('fs');
const twit = require('twit');
const sentiment = require('sentiment');
const twitter_keys = require('../.secrets/twitter');

const Twitter = new twit(twitter_keys);
const Sentiment = new sentiment();

var express = require('express');
var router = express.Router();

var stream = Twitter.stream('statuses/filter', { track: ['#melbournecup2018']})
stream.on('tweet', function (tweet) {
  mood_comp = Sentiment.analyze(tweet.text).comparative;
  mood_score = Sentiment.analyze(tweet.text).score;
  console.log("Text: " + tweet.text);
  console.log("Mood_Score: " + mood_score)
  console.log("Mood_Comp: " + mood_comp + "\n");
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
