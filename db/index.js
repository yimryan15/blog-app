const pg = require('pg');

const client = new pg.Pool({
  user: 'rnojozpndkgomm', //postgres local
  host: '127.0.0.1', // 127.0.0.1 local
  database: 'dd3t143r30v9cl', //blog local
  password: 'e437eaf2096db871d2ebd957384bdc54e9ac45d923ad00134cc11b2c2effbc92', // root local
  port: 5432,
});

module.exports.query = (queryString, queryParameters, callback) => {
  client.query(queryString, queryParameters, (err, res) => {
    if (err) {
      console.log('Error in DB: ' + err)
      throw err
    }
    callback(err, res);
  })
}
