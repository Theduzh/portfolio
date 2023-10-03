const multer = require("multer");
const { nanoid } = require("nanoid");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads/");
    },
    filename: (req, file, callback) => {
        callback(null, nanoid(10) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10240 * 1024 }
}).single("file");

module.exports = { upload };