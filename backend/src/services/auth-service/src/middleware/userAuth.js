const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    // Check if cookies exist first
    if (!req.cookies) {
        return res.json({success: false, message: 'Cookies not available. Please ensure cookie-parser middleware is configured.'});
    }

    const {token} = req.cookies;
    
    if (!token) {
        return res.json({success: false, message: 'Not Authorized. Login Again'});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecode.id) {
            req.userId = tokenDecode.id;
        } else {
            return res.json({success: false, message: 'Not Authorized. Login Again'});
        }
        
        next();
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

module.exports = userAuth;