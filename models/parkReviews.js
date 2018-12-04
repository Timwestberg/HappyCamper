module.exports = function(sequelize, DataTypes) {
    var ParkReviews = sequelize.define("ParkReviews", {
      parkCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reviewer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      reviewText: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });
    return ParkReviews;
  };
