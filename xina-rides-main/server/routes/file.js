const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/auth.js");
const { upload } = require("../middleware/upload.js");

router.post("/upload", validateToken, upload, (req, res) => {
    res.json({ filename: req.file.filename });
});

module.exports = router;
