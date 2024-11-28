const igRouter = require('./instagram');
const tiktokRouter = require('./tiktok');
const router = require('express').Router();
const truncateController = require('../controller/truncate.controller');
const uploadNewData = require('../controller/upload.controller');
const { uploadExcel } = require('../helpers/multer.helper');


router.use("/instagram", igRouter)
router.use("/tiktok", tiktokRouter)
router.post("/truncate", truncateController )
router.post("/upload-data", uploadExcel, uploadNewData )


module.exports = router