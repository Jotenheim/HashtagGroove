const fs = require('fs');
const request = require('request-promise');
const querystring = require('querystring');

const spotify_keys = require('../.secrets/spotify');
const seeds = require('../bin/seeds');

const userID = 'jvmp2s1p901haxewtxy87iz23';
const access_encode = new Buffer(spotify_keys.clientID + ':' + spotify_keys.clientSecret).toString('base64');

const Spotify = {
  refreshSpotifyToken: async function() {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + access_encode
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: spotify_keys.refreshToken
      },
      json: true
    };

    request.post(authOptions)
      .then((data) => {
        spotify_keys.accessToken = data.access_token;
        fs.writeFile(`./.secrets/spotify.json`, JSON.stringify(spotify_keys), 'utf-8', (error) => {
          if (error) { console.log(error); }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  },

  addNewPlaylist: async function(term) {
    await this.refreshSpotifyToken();
    const options = {
      url: `https://api.spotify.com/v1/users/${userID}/playlists`,
      body: JSON.stringify({
        name: 'Hashtag Groove - ' + term,
        description: `This is the Hashtag Groove playlist for ${term}. Either listen along here or create a new playlist at bearfoot.design!`
      }),
      headers: {
        'Authorization': 'Bearer ' + spotify_keys.accessToken,
        'Content-Type': 'application/json'
      }
    };

    return await request.post(options)
      .then((data) => {
        term_info = {
          "term": term,
          "country": 'AU',
          "playlistID": JSON.parse(data).id,
          "playlistLink": JSON.parse(data).external_urls.spotify,
          "mood": 0.5,
        };

        return term_info;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  addTrackToPlaylist: async function(playlistID, songID) {
    const options = {
      url: `https://api.spotify.com/v1/playlists/${playlistID}/tracks?uris=spotify:track:${songID}`,
      headers: { 'Authorization': 'Bearer ' + spotify_keys.accessToken }
    }

    request.post(options)
      .then((data) => {

      })
      .catch((error) => {
        console.log(error);
      });
  },

  findNewTrack: async function (term, semantic) {
    await this.refreshSpotifyToken();

    let keys = Object.keys(seeds);
    let index = [];
    let seed_string = '';

    while (index.length < 5) {
      let value = Math.round(Math.random() * (keys.length - 1));
      if(!index.includes(value)) {
        index.push(value);
        seed_string += seeds[keys[value]].id;

        if(index.length != 5) {
          seed_string += ',';
        }
      }
    }

    const options = {
      url: 'https://api.spotify.com/v1/recommendations?' +
        querystring.stringify({
          limit: 10,
          market: 'AU',
          target_valence: semantic,
          target_energy: semantic,
          seed_artists: seed_string // Randomise seeds, add artists?
        }),
      headers: { 'Authorization': 'Bearer ' + spotify_keys.accessToken },
      json: true
    };

    return await request.get(options)
      .then((data) => {
        let song = Math.round(Math.random() * 9);
        console.log(term + " - " + data.tracks[song].name);
        return data.tracks[song].id;
      })
      .catch((error) => {
        console.log(error);
      })
  }
}

module.exports = Spotify;
