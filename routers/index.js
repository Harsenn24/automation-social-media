const igRouter = require('./instagram');
const tiktokRouter = require('./tiktok');
const router = require('express').Router();
const truncateController = require('../controller/truncate.controller');
const uploadNewData = require('../controller/upload.controller');
const { uploadExcel } = require('../helpers/multer.helper');
const webInter77 = require('./web_inter_77');


router.use("/instagram", igRouter)
router.use("/tiktok", tiktokRouter)
router.use("/web-inter-77", webInter77)
router.post("/truncate", truncateController )
router.post("/upload-data", uploadExcel, uploadNewData )


module.exports = router