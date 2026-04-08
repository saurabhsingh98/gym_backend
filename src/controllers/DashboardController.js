const DashboardService = require('../services/DashboardService');
const catchAsync = require('../utils/catchAsync');

class DashboardController {
  static getDashboardSummary = catchAsync(async (req, res, next) => {
    const summary = await DashboardService.getDashboardSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  });

  static getMembersInsights = catchAsync(async (req, res, next) => {
    const insights = await DashboardService.getMembersInsights();

    res.status(200).json({
      success: true,
      data: insights,
    });
  });

  static getRevenueInsights = catchAsync(async (req, res, next) => {
    const insights = await DashboardService.getRevenueInsights();

    res.status(200).json({
      success: true,
      data: insights,
    });
  });

  static getGymWiseStats = catchAsync(async (req, res, next) => {
    const stats = await DashboardService.getGymWiseStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  static getRecentActivity = catchAsync(async (req, res, next) => {
    const activity = await DashboardService.getRecentActivity();

    res.status(200).json({
      success: true,
      data: activity,
    });
  });
}

module.exports = DashboardController;
