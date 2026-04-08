const express = require('express');
const { body, param } = require('express-validator');
const GymOwnerMappingController = require('../controllers/GymOwnerMappingController');
const validateRequest = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('gym_id').notEmpty().withMessage('Gym ID is required').isMongoId().withMessage('Invalid Gym ID'),
    body('owner_id')
      .notEmpty()
      .withMessage('Owner ID is required')
      .isMongoId()
      .withMessage('Invalid Owner ID'),
  ],
  validateRequest,
  GymOwnerMappingController.createMapping
);

router.get('/:id', GymOwnerMappingController.getMapping);

router.get('/owner/:ownerId', GymOwnerMappingController.getMappingsByOwner);

router.get('/gym/:gymId', GymOwnerMappingController.getMappingsByGym);

router.delete('/:id', GymOwnerMappingController.deleteMapping);

module.exports = router;
