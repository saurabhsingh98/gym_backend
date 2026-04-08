const express = require('express');
const { body } = require('express-validator');
const GymController = require('../controllers/GymController');
const validateRequest = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Gym name is required').isString().trim(),
    body('address').notEmpty().withMessage('Address is required').isString().trim(),
    body('phone').optional().isString().trim(),
  ],
  validateRequest,
  GymController.createGym
);

router.get('/', GymController.getAllGyms);

router.get('/:id', GymController.getGym);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim(),
    body('address').optional().isString().trim(),
    body('phone').optional().isString().trim(),
  ],
  validateRequest,
  GymController.updateGym
);

router.delete('/:id', GymController.deleteGym);

module.exports = router;
