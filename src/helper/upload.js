const multer = require("multer");

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "assets/uploads/");
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const options = multer({
    storage: storage,
    limits: {
        fileSize: 2000 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb("Only image are allowed.", false);
        }
        cb(null, true);
    },
});


module.exports = options;