const userModel = require("../models/user-data.model");
const global_response = require("../response/global.response");

async function uploadNewData(req, res, next) {
    try {
        const usersData = req.userListData

        let arrayData = []

        for (let i = 0; i < usersData.length; i++) {

            const objUser = {
                user_id: usersData[i].id,
                running: 1,
                detail: '-',
                createdAt: new Date().getTime() / 1000,
                updatedAt: new Date().getTime() / 1000,
                active: 1
            }

            arrayData.push(objUser)

        }

        await userModel.bulkCreate(arrayData, { validate: true })

        res.status(200).json(global_response("SUCCESS", 200, { message: "sukses upload" }));

    } catch (error) {
        res.status(400).json(global_response("FAILED", 400, error.toString()));
    }
}

module.exports = uploadNewData