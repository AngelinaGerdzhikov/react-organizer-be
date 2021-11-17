const Sequelize = require("sequelize");

const dbConfig = require("../config/db.config");

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};

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
db.tasks = require('./task.model.js')(sequelize);

db.tasks.belongsTo(db.statuses, {
  foreignKey: "status_id",
  as: "status",
});

module.exports = db;
