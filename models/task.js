const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Task', {
    specialty: DataTypes.STRING, // beading, shoemaking, etc
    status: {
      type: DataTypes.ENUM('ASSIGNED', 'DONE'),
      defaultValue: 'ASSIGNED'
    }
  });
};
