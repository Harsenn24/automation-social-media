const igRouter = require('./instagram');
const router = require('express').Router();

router.use("/instagram", igRouter)

module.exports = router