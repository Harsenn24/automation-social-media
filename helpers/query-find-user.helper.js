const { QueryTypes } = require("sequelize");
const sequelize = require("../config/index");

async function queryFindUser() {
    const findUsers = await sequelize.query(
        `
        SELECT u.user_id 
        FROM users u 
        WHERE u.active = 1;
        `,
        {
            type: QueryTypes.SELECT,
        }
    );

    return findUsers
}

module.exports = queryFindUser