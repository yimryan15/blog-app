const pg = require('pg');

const client = new pg.Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'blog',
  password: 'root',
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
