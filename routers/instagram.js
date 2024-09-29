const like_instagram_worker = require("../controller/instagram/like")
const reels_view = require("../controller/instagram/reels")
const igRouter = require("express").Router()

igRouter.post("/like", like_instagram_worker)
igRouter.post("/reels", reels_view)


module.exports = igRouter