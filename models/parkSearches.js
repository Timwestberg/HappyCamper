module.exports = function(sequelize, DataTypes) {
  var ParkSearches = sequelize.define("ParkSearches", {
    parkCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    states: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });
  return ParkSearches;
};
