const { QueryTypes } = require("sequelize");
const sequelize = require("../config/index");

const offsetLimit = `LIMIT 1000 OFFSET 256`

async function queryFindUser() {

    const findUserNotActive = await sequelize.query(`
        select
            u.user_id, u.id
        from
            users u
        where
            u.active = 0
        `,
        {
            type: QueryTypes.SELECT
        }
    )

    if (findUserNotActive.length == 0) {

        const userActive = await sequelize.query(
            `
            select
                u.user_id 
            FROM 
                users u 
            WHERE
                u.active = 1;
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        return userActive
    } else {
        const users_inactive_last_id = findUserNotActive[findUserNotActive.length - 1]

        const [total_data] = await sequelize.query(
            `
            select
                count(u.id) as total_count
            from
                users u
            `
            , {
                type: QueryTypes.SELECT
            }
        )

        const limit = total_data.total_count - users_inactive_last_id.id

        const offset = users_inactive_last_id.id

        const remain_data = await sequelize.query(
            `
            select
                u.user_id , u.id
            FROM 
                users u 
            limit ${limit} offset ${offset}
            `,
            {
                type: QueryTypes.SELECT
            }
        )

        return remain_data

    }



}

module.exports = queryFindUser