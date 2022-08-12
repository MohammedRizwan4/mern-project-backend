const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Mynameismohammedrizwan'

const fetchuser = (req, res, next) => {
    // get the user from the jwt token and append id to req

    try {
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).json({ error: "Invalid Token" });
        }
        const data = jwt.verify(token, SECRET_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }

}
module.exports = fetchuser;