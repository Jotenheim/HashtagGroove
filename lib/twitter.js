const fs = require('fs');
const twit = require('twit');
const sentiment = require('sentiment');
const twitter_keys = require('../.secrets/twitter');

const Twitter = new twit(twitter_keys);
const Sentiment = new sentiment();

const TwitterConnector = {
  getTweetMood: async function() {

  },

}
