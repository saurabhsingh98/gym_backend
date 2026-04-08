const express = require('express');
const DashboardController = require('../controllers/DashboardController');

const router = express.Router();

router.get('/summary', DashboardController.getDashboardSummary);

router.get('/members-insights', DashboardController.getMembersInsights);

router.get('/revenue-insights', DashboardController.getRevenueInsights);

router.get('/gym-stats', DashboardController.getGymWiseStats);

router.get('/recent-activity', DashboardController.getRecentActivity);

module.exports = router;
