const express = require('express');
const { body } = require('express-validator');
const OwnerController = require('../controllers/OwnerController');
const validateRequest = require('../middlewares/validate');
const protect = require('../middlewares/auth');
const upload = require('../utils/multerConfig');

const router = express.Router();

router.post(
  '/register',
  upload.single('photo'),
  [
    body('name').notEmpty().withMessage('Owner name is required').isString().trim(),
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain lowercase, uppercase, and number'),
    body('address').optional().isString().trim(),
    body('phone').optional().isString().trim(),
  ],
  validateRequest,
  OwnerController.registerOwner
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  OwnerController.loginOwner
);

router.get('/profile', protect, OwnerController.getProfile);

router.get('/', OwnerController.getAllOwners);

router.put(
  '/:id',
  upload.single('photo'),
  [
    body('name').optional().isString().trim(),
    body('address').optional().isString().trim(),
    body('phone').optional().isString().trim(),
  ],
  validateRequest,
  OwnerController.updateOwner
);

router.delete('/:id', OwnerController.deleteOwner);

module.exports = router;
