const { QueryTypes } = require("sequelize");
const sequelize = require("../config/index");

async function queryFindUser(active) {

    const userActive = await sequelize.query(
        `
        select
            u.user_id 
        FROM 
            users u 
        WHERE
            u.active = :active;
        `,
        {
            type: QueryTypes.SELECT,
            replacements: { active: active === "true" ? "1" : "0" }
        }
    );

    return userActive

}

module.exports = queryFindUser