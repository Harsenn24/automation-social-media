const multer = require('multer');
const storage = multer.memoryStorage();
const xlsx = require('xlsx');
const global_response = require('../response/global.response');
const maxSize = 10 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    const whitelist = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!whitelist.includes(file.mimetype)) {
        cb({
            msg: "File must be in XLSX",
            error: "File must be in XLSX",
        });

        return;
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxSize,
    },
    fileFilter: fileFilter,
}).single('userList')


exports.uploadExcel = (req, res, next) => {
    try {
        upload(req, res, (err) => {
            if (err) res.status(400).json(global_response("FAILED", 400, err.toString()));

            console.log(req.File)

            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            req.userListData = data;

            next()
        });
    } catch (error) {
        res.status(400).json(global_response("FAILED", 400, error.toString()));
    }
};