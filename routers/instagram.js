const like_instagram = require("../controller/instagram/like-trial")
const igRouter = require("express").Router()

igRouter.post("/like", like_instagram)


module.exports = igRouter