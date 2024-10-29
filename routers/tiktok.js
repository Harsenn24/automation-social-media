const comment_tiktok = require("../controller/tiktok/command")
const like_tiktok = require("../controller/tiktok/like")
const view_tiktok = require("../controller/tiktok/view")
const tiktokRouter = require("express").Router()

tiktokRouter.post("/like", like_tiktok)
tiktokRouter.post("/view", view_tiktok)
tiktokRouter.post("/comment", comment_tiktok)



module.exports = tiktokRouter