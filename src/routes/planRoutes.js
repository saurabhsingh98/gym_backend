const express = require('express');
const { body } = require('express-validator');
const PlanController = require('../controllers/PlanController');
const validateRequest = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Plan name is required').isString().trim(),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('validity')
      .notEmpty()
      .withMessage('Validity is required')
      .isInt({ min: 1 })
      .withMessage('Validity must be at least 1 day'),
  ],
  validateRequest,
  PlanController.createPlan
);

router.get('/', PlanController.getAllPlans);

router.get('/:id', PlanController.getPlan);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('validity').optional().isInt({ min: 1 }).withMessage('Validity must be at least 1 day'),
  ],
  validateRequest,
  PlanController.updatePlan
);

router.delete('/:id', PlanController.deletePlan);

module.exports = router;
