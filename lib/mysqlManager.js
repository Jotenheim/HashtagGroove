const mysql = require('mysql');

var pool = mysql.createPool({
  host: 'braggin-bowl.cnemk4eho4nt.us-west-2.rds.amazonaws.com',
  user: 'node',
  password: 'testPassForLulz',
  database: 'HashtagGroove',
  debug: 'false'
});

var Manager = {
  getAllTerms: async function(callback) {
    return await pool.query("SELECT * FROM terms", callback);
  },
  addTerm: function(term_info, callback) {
    return pool.query("INSERT INTO terms(term, country, playlistID, playlistLink) VALUES (?,'AU',?,?)", [term_info.term, term_info.playlistID, term_info.playlistLink], callback);
  },
  removeTerm: function(term_name, callback) {
    return pool.query("DELETE FROM terms WHERE term=?", [term_name], callback);
  }
}

module.exports = Manager;
