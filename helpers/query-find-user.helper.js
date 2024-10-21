const { QueryTypes } = require("sequelize");
const sequelize = require("../config/index");

const offsetLimit = `LIMIT 1000 OFFSET 256`

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