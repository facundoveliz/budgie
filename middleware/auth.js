const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // checks if a token exists
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(403).json({
      ok: false,
      msg: 'Access denied, no token provided',
    });
  }

  try {
    // decodes the token and verify if its right
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: 'Invalid token',
      result: err,
    });
  }
};
