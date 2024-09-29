const igRouter = require('./instagram');
const tiktokRouter = require('./tiktok');
const router = require('express').Router();

router.use("/instagram", igRouter)
router.use("/tiktok", tiktokRouter)

module.exports = router