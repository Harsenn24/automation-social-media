const comment_instagram = require("../controller/instagram/comment")
const like_instagram = require("../controller/instagram/like")
const igRouter = require("express").Router()

igRouter.post("/like", like_instagram)
igRouter.post("/comment", comment_instagram)

module.exports = igRouter