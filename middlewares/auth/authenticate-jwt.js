const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
	const token = req.headers['x-auth-token'];
	if (!token) {
		return res.status(401).json({ message: 'Authentication failed: No token provided' });
	}
	jwt.verify(token, 'your_secret_key', (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: 'Authentication failed: Invalid token' });
		}
		req.user = decoded.user;
		next();
	});
};

module.exports = authenticateJWT;
