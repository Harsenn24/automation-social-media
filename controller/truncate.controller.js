const sequelize = require("../config/index");
const global_response = require("../response/global.response");

async function truncateData(req, res) {
    await sequelize.query(`truncate table users`)
    res.status(200).json(global_response("SUCCESS", 200, { message: "sukses truncate" }));
}

module.exports = truncateData

