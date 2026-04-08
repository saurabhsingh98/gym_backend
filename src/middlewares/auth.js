const { verifyToken } = require('../utils/jwtUtils');
const Owner = require('../models/Owner');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new AppError('Invalid token', 401));
    }

    const owner = await Owner.findById(decoded.id).active();

    if (!owner) {
      return next(new AppError('Owner not found', 404));
    }

    req.owner = owner;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;
