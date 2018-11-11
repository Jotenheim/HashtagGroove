const express = require('express');
const router = express.Router();
const Spotify = require('../lib/spotify');
const terms = require('../bin/terms');
const fs = require('fs');

const twit = require('twit');
const twitter_keys = require('../.secrets/twitter');
const Twitter = new twit(twitter_keys);

const sentiment = require('sentiment');
const Sentiment = new sentiment();

let stream =  Twitter.stream('statuses/filter', { track: ['#', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'], language: 'en' });
stream.on('tweet', async function (tweet) {
  var mood = (Sentiment.analyze(tweet.text).score + 5) / 10;
  if (mood > 1) {
    mood = 1;
  } else if (mood < 0) {
    mood = 0;
  }

  for (var term in terms) {
    if (tweet.text.includes(term)) {
      const songInfo = await Spotify.findNewTrack(term, mood);
      Spotify.addTrackToPlaylist(terms[term].playlistID, songInfo);
    }
  }
});

const updateTerms = async function (term) {
  if (term in terms) {
    delete terms[term];
    fs.writeFileSync('./bin/terms.json', JSON.stringify(terms), 'utf-8');
  } else {
    const term_info = await Spotify.addNewPlaylist(term);
    terms[term_info.term] = term_info;
    fs.writeFileSync('./bin/terms.json', JSON.stringify(terms), 'utf-8');
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { terms: terms });
});

router.post('/new_term', async function(req, res, next) {
  await updateTerms(req.body.new_term);
  res.redirect('/');
})

module.exports = router;
