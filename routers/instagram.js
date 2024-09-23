const like_instagram_worker = require("../controller/instagram/like")
const igRouter = require("express").Router()

igRouter.post("/like", like_instagram_worker)

module.exports = igRouter