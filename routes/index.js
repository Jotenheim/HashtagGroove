const express = require('express');
const router = express.Router();
const Spotify = require('../lib/spotify');
const Manager = require('../lib/mysqlManager');

const twit = require('twit');
const twitter_keys = require('../.secrets/twitter');
const Twitter = new twit(twitter_keys);

const sentiment = require('sentiment');
const Sentiment = new sentiment();

let terms = {};

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

/* GET home page. */
router.get('/', async function(req, res, next) {
  Manager.getAllTerms(async function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.render('index', { terms: rows });
    }
  });
});

router.post('/new_term', async function(req, res, next) {
  Manager.getAllTerms(async function(err, rows) {
      if (err) {
        console.log(err);
      } else {
        let seen = false;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].term === req.body.new_term) {
            seen = true;
          }
          console.log(rows[i].term);
        }
        if (seen) {
          Manager.removeTerm(req.body.new_term, function (err, count) {
            if (err) {
              res.json(err);
            } else {
              res.redirect('/');
              if (terms[req.body.new_term]) { delete terms[req.body.new_term] };
            }
          });
        } else {
          const term_info = await Spotify.addNewPlaylist(req.body.new_term);
          terms[req.body.new_term] = term_info;
          Manager.addTerm(term_info, function (err, count) {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/');
            }
          });
        }
      }
  });
});

module.exports = router;
