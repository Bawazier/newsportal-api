const jwt = require("jsonwebtoken");
const responeStandart = require("../helper/respone");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.slice(7, authorization.length);
        try {
            const user = jwt.verify(token, process.env.APP_KEY);
            if (user) {
                req.user = user;
                next();
            } else {
                return responeStandart(res, "Unauthorization", {}, 401, false);
            }
        } catch (err) {
            return responeStandart(res, err.message, {}, 500, false);
        }
    } else {
        return responeStandart(res, "Forbidden access", {}, 403, false);
    }
};