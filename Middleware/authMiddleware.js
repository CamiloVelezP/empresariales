const jwt = require('jsonwebtoken');
const secretKey = 'duck';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        req.user = user;
        next();
    });
};


const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        // Assuming the user role is stored in the user object
        const userRole = req.user.role;

        if (userRole !== requiredRole) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        next();
    };
};


module.exports = {
    authenticateToken,
    authorizeRole,
};