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

let terms = ['#', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'];
let stream =  Twitter.stream('statuses/filter', { track: terms, language: 'en' });
stream.on('tweet', function (tweet) {
  var mood = (Sentiment.analyze(tweet.text).score + 5) / 10;
  if (mood > 1) {
    mood = 1;
  } else if (mood < 0) {
    mood = 0;
  }

  console.log(tweet.text);
  console.log(`Mood: ${mood}\n`);
});

/*const updateStream = function (new_term) {
  if (terms.includes(new_term)) {
    terms.splice(terms.indexOf(new_term), 1);
  } else {
    terms.push(new_term);
  }

  if (terms.length > 0) {
    let new_stream = ;;

    new_stream.once('connected', function (res) {
      console.log("NEW STREAM START");
      console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
      if (stream != null) {
        stream.stop();
      }

      stream = new_stream;

      stream.on('tweet', function (tweet) {
        var mood = (Sentiment.analyze(tweet.text).score + 5) / 10;
        if (mood > 1) {
          mood = 1;
        } else if (mood < 0) {
          mood = 0;
        }

        console.log(tweet.text);
        console.log(terms);
        console.log(`Mood: ${mood}\n`);
      });
    });
  }
}*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { terms: terms });
});

router.post('/new_term', function(req, res, next) {
  updateStream(req.body.new_term);
  res.redirect('/');
})

module.exports = router;
