const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define("task", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: Sequelize.TEXT,
    due_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  return Task;
};