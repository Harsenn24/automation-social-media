const like_tiktok = require("../controller/tiktok/like")
const tiktokRouter = require("express").Router()

tiktokRouter.post("/like", like_tiktok)

module.exports = tiktokRouter