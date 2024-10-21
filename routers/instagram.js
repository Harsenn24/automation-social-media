const like_instagram = require("../controller/instagram/like-trial")
const reels_view = require("../controller/instagram/view")
const igRouter = require("express").Router()

igRouter.post("/like", like_instagram)
igRouter.post("/reels", reels_view)


module.exports = igRouter