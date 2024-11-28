const { QueryTypes } = require("sequelize");
const sequelize = require("../config/index");
const limit = `limit 840 offset 256`

async function queryFindUser() {

    const userActive = await sequelize.query(
        `
        select
            u.user_id 
        FROM 
            users u 
        `,
        {
            type: QueryTypes.SELECT,
        }
    );

    return userActive

}

module.exports = queryFindUser