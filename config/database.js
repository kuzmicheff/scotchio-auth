var dbURI = 'postgres://' + 
  process.env.dbUser + ':' + 
  process.env.dbPass + '@' + 
  process.env.dbHost;

module.exports = {
  'url': dbURI
};