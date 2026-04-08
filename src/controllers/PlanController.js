const PlanService = require('../services/PlanService');
const catchAsync = require('../utils/catchAsync');

class PlanController {
  static createPlan = catchAsync(async (req, res, next) => {
    const plan = await PlanService.createPlan(req.body);

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });
  });

  static getPlan = catchAsync(async (req, res, next) => {
    const plan = await PlanService.getPlan(req.params.id);

    res.status(200).json({
      success: true,
      data: plan,
    });
  });

  static getAllPlans = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await PlanService.getAllPlans(parseInt(page), parseInt(limit), search);

    res.status(200).json({
      success: true,
      data: result.plans,
      pagination: result.pagination,
    });
  });

  static updatePlan = catchAsync(async (req, res, next) => {
    const plan = await PlanService.updatePlan(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  });

  static deletePlan = catchAsync(async (req, res, next) => {
    const plan = await PlanService.deletePlan(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Plan deleted successfully',
      data: plan,
    });
  });
}

module.exports = PlanController;
