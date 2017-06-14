var bcrypt = require('bcrypt-nodejs');
var jwt =    require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    localemail        : DataTypes.STRING,
    localpassword     : DataTypes.STRING,
    facebookid        : DataTypes.STRING,
    facebooktoken     : DataTypes.STRING,
    facebookemail     : DataTypes.STRING,
    facebookname      : DataTypes.STRING,
    paypalid          : DataTypes.STRING,
    paypaltoken       : DataTypes.STRING,
    paypalemail       : DataTypes.STRING,
    paypalname        : DataTypes.STRING,
  });
  User.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.localpassword);
  };
  User.prototype.generateJwt = function() {
    return jwt.sign({
      id: this.id,
      email: this.email,
      name: this.name,
    }, 
    process.env.tokenSecret,
    {
      expiresInMinutes: 1440
    });
  }
  return User;
};
