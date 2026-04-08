const MemberService = require('../services/MemberService');
const catchAsync = require('../utils/catchAsync');

class MemberController {
  static createMember = catchAsync(async (req, res, next) => {
    const member = await MemberService.createMember(req.body, req.file);

    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member,
    });
  });

  static getMember = catchAsync(async (req, res, next) => {
    const member = await MemberService.getMember(req.params.id);

    res.status(200).json({
      success: true,
      data: member,
    });
  });

  static getAllMembers = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10, search = '', gymId } = req.query;

    const result = await MemberService.getAllMembers(
      parseInt(page),
      parseInt(limit),
      search,
      gymId
    );

    res.status(200).json({
      success: true,
      data: result.members,
      pagination: result.pagination,
    });
  });

  static updateMember = catchAsync(async (req, res, next) => {
    const member = await MemberService.updateMember(req.params.id, req.body, req.file);

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member,
    });
  });

  static deleteMember = catchAsync(async (req, res, next) => {
    const member = await MemberService.deleteMember(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully',
      data: member,
    });
  });

  static getMembersWithExpiringPlans = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await MemberService.getMembersWithExpiringPlans(parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result.members,
      pagination: result.pagination,
      message: 'Members with plans expiring within 7 days',
    });
  });

  static getActiveMembers = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await MemberService.getActiveMembers(parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result.members,
      pagination: result.pagination,
    });
  });

  static getExpiredMembers = catchAsync(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await MemberService.getExpiredMembers(parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      data: result.members,
      pagination: result.pagination,
    });
  });
}

module.exports = MemberController;
