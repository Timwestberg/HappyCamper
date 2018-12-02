module.exports = function(sequelize, DataTypes) {
  var StateSearches = sequelize.define("StateSearches", {
    stateCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });
  return StateSearches;
};
