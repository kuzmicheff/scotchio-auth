var mongoose = require('mongoose');

var dbURI = "mongodb://" + 
  process.env.dbUser + ":" + 
  process.env.dbPass + "@" + 
  process.env.dbHost;

module.exports = {
  "url": dbURI
}