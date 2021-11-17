const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const Status = sequelize.define("status", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });

  return Status;
}

