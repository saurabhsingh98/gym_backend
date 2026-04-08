const GymService = require('../services/GymService');
const catchAsync = require('../utils/catchAsync');

class GymController {
  static createGym = catchAsync(async (req, res, next) => {
    const gym = await GymService.createGym(req.body);

    res.status(201).json({
      success: true,
      message: 'Gym created successfully',
      data: gym,
    });
  });

  static getGym = catchAsync(async (req, res, next) => {
    const gym = await GymService.getGym(req.params.id);

    res.status(200).json({
      success: true,
      data: gym,
    });
  });

  static getAllGyms = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await GymService.getAllGyms(parseInt(page), parseInt(limit), search);

    res.status(200).json({
      success: true,
      data: result.gyms,
      pagination: result.pagination,
    });
  });

  static updateGym = catchAsync(async (req, res, next) => {
    const gym = await GymService.updateGym(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Gym updated successfully',
      data: gym,
    });
  });

  static deleteGym = catchAsync(async (req, res, next) => {
    const gym = await GymService.deleteGym(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Gym deleted successfully',
      data: gym,
    });
  });
}

module.exports = GymController;
