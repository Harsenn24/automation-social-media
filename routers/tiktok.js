const like_tiktok = require("../controller/tiktok/trial")
const view_tiktok_trial = require("../controller/tiktok/trial-view")
const view_tiktok = require("../controller/tiktok/view")
const tiktokRouter = require("express").Router()

tiktokRouter.post("/like", like_tiktok)
tiktokRouter.post("/view", view_tiktok_trial)

module.exports = tiktokRouter