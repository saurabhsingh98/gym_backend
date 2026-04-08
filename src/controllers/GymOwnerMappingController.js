const GymOwnerMappingService = require('../services/GymOwnerMappingService');
const catchAsync = require('../utils/catchAsync');

class GymOwnerMappingController {
  static createMapping = catchAsync(async (req, res, next) => {
    const mapping = await GymOwnerMappingService.createMapping(req.body);

    res.status(201).json({
      success: true,
      message: 'Mapping created successfully',
      data: mapping,
    });
  });

  static getMapping = catchAsync(async (req, res, next) => {
    const mapping = await GymOwnerMappingService.getMapping(req.params.id);

    res.status(200).json({
      success: true,
      data: mapping,
    });
  });

  static getMappingsByOwner = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await GymOwnerMappingService.getMappingsByOwner(
      req.params.ownerId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: result.mappings,
      pagination: result.pagination,
    });
  });

  static getMappingsByGym = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await GymOwnerMappingService.getMappingsByGym(
      req.params.gymId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: result.mappings,
      pagination: result.pagination,
    });
  });

  static deleteMapping = catchAsync(async (req, res, next) => {
    const mapping = await GymOwnerMappingService.deleteMapping(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mapping deleted successfully',
      data: mapping,
    });
  });
}

module.exports = GymOwnerMappingController;
