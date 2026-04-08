const OwnerService = require('../services/OwnerService');
const catchAsync = require('../utils/catchAsync');

class OwnerController {
  static registerOwner = catchAsync(async (req, res, next) => {
    const result = await OwnerService.registerOwner(req.body, req.file);

    res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      data: result.owner,
      token: result.token,
    });
  });

  static loginOwner = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const result = await OwnerService.loginOwner(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result.owner,
      token: result.token,
    });
  });

  static getProfile = catchAsync(async (req, res, next) => {
    const owner = await OwnerService.getOwnerProfile(req.owner._id);

    res.status(200).json({
      success: true,
      data: owner,
    });
  });

  static getAllOwners = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await OwnerService.getAllOwners(parseInt(page), parseInt(limit), search);

    res.status(200).json({
      success: true,
      data: result.owners,
      pagination: result.pagination,
    });
  });

  static updateOwner = catchAsync(async (req, res, next) => {
    const owner = await OwnerService.updateOwner(req.params.id, req.body, req.file);

    res.status(200).json({
      success: true,
      message: 'Owner updated successfully',
      data: owner,
    });
  });

  static deleteOwner = catchAsync(async (req, res, next) => {
    const owner = await OwnerService.deleteOwner(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Owner deleted successfully',
      data: owner,
    });
  });
}

module.exports = OwnerController;
