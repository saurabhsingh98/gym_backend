const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    return next(new AppError(`Validation Error: ${JSON.stringify(formattedErrors)}`, 400));
  }

  next();
};

module.exports = validateRequest;
