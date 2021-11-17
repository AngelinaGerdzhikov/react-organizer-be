const Sequelize = require("sequelize");

const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
      ...dbConfig.pool
    }
  }
);

const db = {};

// db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.statuses = require('./status.model.js')(sequelize);
// (sequelize, Sequelize);

module.exports = db;
