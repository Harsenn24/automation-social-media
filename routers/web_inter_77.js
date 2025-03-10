const view_inter_77 = require("../controller/web_inter_77/view")
const webInter77 = require("express").Router()

webInter77.post("/view", view_inter_77)

module.exports = webInter77