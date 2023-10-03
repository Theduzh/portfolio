const { verify } = require("jsonwebtoken");
require("dotenv").config();

const validateToken = (req, res, next) => {
    try {
        const accessToken = req.header("Authorization").split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({
                message: `Unauthorised.`,
            });
        }

        const payload = verify(accessToken, process.env.APP_SECRET);
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: `Authorisation issue.`,
        });
    }
};

module.exports = { validateToken };
