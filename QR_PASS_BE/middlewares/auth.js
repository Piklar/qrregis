const CryptoJS = require('crypto-js');

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const bytes = CryptoJS.AES.decrypt(token, process.env.ADMIN_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    const decoded = JSON.parse(decrypted);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

module.exports = { verifyAdmin };