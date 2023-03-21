require('dotenv').config({path:'./.env.local'});
var jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate with valid token!" });
    }

    try {
       const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ errors: "Please authenticate with valid token!" });
    }
}

module.exports = fetchuser;