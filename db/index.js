const pg = require('pg');

const client = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
});

// const client = new pg.Pool({
//   user: 'postgres',
//   host: '127.0.0.1',
//   database: 'blog',
//   password: 'root',
//   port: 5432,
// });

module.exports.query = (queryString, queryParameters, callback) => {
  client.query(queryString, queryParameters, (err, res) => {
    if (err) {
      console.log('Error in DB: ' + err)
      throw err
    }
    callback(err, res);
  })
}

// pg.defaults.ssl = true;
// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   if (err) {
//     console.log(err);
//     throw err;
//   }
//   console.log('Connected to postgres! Getting schemas...');
// });
