const express = require('express');
const { body } = require('express-validator');
const MemberController = require('../controllers/MemberController');
const validateRequest = require('../middlewares/validate');
const upload = require('../utils/multerConfig');

const router = express.Router();

router.post(
  '/',
  upload.single('photo'),
  [
    body('name').notEmpty().withMessage('Member name is required').isString().trim(),
    body('phone').notEmpty().withMessage('Phone is required').isString().trim(),
    body('address').optional().isString().trim(),
    body('gym_id').notEmpty().withMessage('Gym ID is required').isMongoId().withMessage('Invalid Gym ID'),
    body('plan_id')
      .notEmpty()
      .withMessage('Plan ID is required')
      .isMongoId()
      .withMessage('Invalid Plan ID'),
    body('plan_start_date').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validateRequest,
  MemberController.createMember
);

router.get('/', MemberController.getAllMembers);

router.get('/expiring/plans', MemberController.getMembersWithExpiringPlans);

router.get('/status/active', MemberController.getActiveMembers);

router.get('/status/expired', MemberController.getExpiredMembers);

router.get('/:id', MemberController.getMember);

router.put(
  '/:id',
  upload.single('photo'),
  [
    body('name').optional().isString().trim(),
    body('phone').optional().isString().trim(),
    body('address').optional().isString().trim(),
    body('gym_id').optional().isMongoId().withMessage('Invalid Gym ID'),
    body('plan_id').optional().isMongoId().withMessage('Invalid Plan ID'),
    body('plan_start_date').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validateRequest,
  MemberController.updateMember
);

router.delete('/:id', MemberController.deleteMember);

module.exports = router;
