// const pg = require('pg');
//
// const client = new pg.Pool({
//   user: 'rnojozpndkgomm', //postgres local
//   host: 'ec2-23-21-186-138.compute-1.amazonaws.com', // 127.0.0.1 local
//   database: 'dd3t143r30v9cl', //blog local
//   password: 'e437eaf2096db871d2ebd957384bdc54e9ac45d923ad00134cc11b2c2effbc92', // root local
//   port: 5432,
// });
//
// module.exports.query = (queryString, queryParameters, callback) => {
//   client.query(queryString, queryParameters, (err, res) => {
//     if (err) {
//       console.log('Error in DB: ' + err)
//       throw err
//     }
//     callback(err, res);
//   })
// }

var pg = require('pg');

pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
