const express = require('express');
const router = express.Router();
const request = require('request-promise');
const querystring = require('querystring');
const fs = require('fs');

const twit = require('twit');
const twitter_keys = require('../.secrets/twitter');
const Twitter = new twit(twitter_keys);

const sentiment = require('sentiment');
const Sentiment = new sentiment();

let stream = Twitter.stream('statuses/filter', { track: ['a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z'], language: 'en' });

stream.on('tweet', function (tweet) {
  var mood = (Sentiment.analyze(tweet.text).score + 5) / 10;
  if (mood > 1) {
    mood = 1;
  } else if (mood < 0) {
    mood = 0;
  }

  console.log(tweet.text);
  console.log(`Mood: ${mood}\n`)
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
