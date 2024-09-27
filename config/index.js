const Sequelize = require("sequelize");

const config = {
    dbHost: process.env.NODE_DB_HOST || '127.0.0.1',
    dbUser: process.env.NODE_DB_USER || 'root',
    dbName: process.env.NODE_DB_DATABASE || 'user_id_adspower',
    dbPassword: process.env.NODE_DB_PASSWORD || 'H@rsennayet19',
    dbPort: process.env.NODE_DB_PORT,
    dbDialect: process.env.NODE_DB_DIALECT || "mysql",
    pool: {
        max: process.env.NODE_DB_POOL_MAX ? +process.env.NODE_DB_POOL_MAX : 10,
        min: process.env.NODE_DB_POOL_MIN ? +process.env.NODE_DB_POOL_MIN : 0,
        acquire: process.env.NODE_DB_POOL_ACQUIRE || 120000,
        idle: process.env.NODE_DB_POOL_IDLE || 20000
    }
};
const dbSosmed = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
    host: config.dbHost,
    dialect: config.dbDialect,
    logging: false,
    omitNull: true,
    pool: config.pool,
    timezone: '+00:00'
});

module.exports = dbSosmed;

