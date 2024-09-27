const { QueryTypes } = require("sequelize");
const sequelize = require("../config/index");
const userModel = require("../models/user-data.model");
const createTimeStamp = require("./create-timestamp.helper");


async function storeData(message, user_id, status) {

    try {
        const [findData] = await sequelize.query(`
            select 
                u.user_id
            from
                users u
            where 
                u.user_id = :user_id
            `, {
            replacements: { user_id },
            type: QueryTypes.SELECT
        })

        if (findData) {
            await userModel.update(
                {
                    running: status,
                    detail: message,
                    updatedAt: createTimeStamp()
                },
                {
                    where: {
                        user_id
                    }
                }
            )


        } else {
            await userModel.create(
                {
                    user_id,
                    running: status,
                    detail: message,
                    updatedAt: createTimeStamp(),
                    createdAt: createTimeStamp()
                }
            )
        }

    } catch (error) {
        console.log(error, "error from store_data_success_error")
    }


}

module.exports = storeData