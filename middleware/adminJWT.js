const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtAdmin = (req, res, next) => {
    const jwttoken = req.headers.authorization;
    let token = jwttoken ? jwttoken.replace(/"/g, '') : null;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

            if (decodedToken.exp > Date.now() / 1000) {
                next();
            } else {
                res.status(401).json({ message: 'Token expired' });
            }
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: 'Invalid token' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(401).json({ message: 'Token missing' });
    }
};

module.exports = jwtAdmin;
