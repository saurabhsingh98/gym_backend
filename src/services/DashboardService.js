const Gym = require('../models/Gym');
const Owner = require('../models/Owner');
const Member = require('../models/Member');
const Plan = require('../models/Plan');
const GymOwnerMapping = require('../models/GymOwnerMapping');

class DashboardService {
  // Get dashboard summary
  static async getDashboardSummary() {
    const totalGyms = await Gym.countDocuments({ isDeleted: false });
    const totalOwners = await Owner.countDocuments({ isDeleted: false });
    const totalMembers = await Member.countDocuments({ isDeleted: false });
    const totalPlans = await Plan.countDocuments({ isDeleted: false });

    return {
      totalGyms,
      totalOwners,
      totalMembers,
      totalPlans,
    };
  }

  // Get members insights
  static async getMembersInsights() {
    const now = new Date();

    const insights = await Member.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'plan_id',
          foreignField: '_id',
          as: 'plan_details',
        },
      },
      {
        $unwind: '$plan_details',
      },
      {
        $addFields: {
          plan_expiry_date: {
            $add: [
              { $toDate: '$plan_start_date' },
              { $multiply: ['$plan_details.validity', 24 * 60 * 60 * 1000] },
            ],
          },
        },
      },
      {
        $facet: {
          active: [
            {
              $match: {
                plan_expiry_date: { $gt: now },
              },
            },
            {
              $count: 'count',
            },
          ],
          expired: [
            {
              $match: {
                plan_expiry_date: { $lt: now },
              },
            },
            {
              $count: 'count',
            },
          ],
          expiring_soon: [
            {
              $match: {
                plan_expiry_date: {
                  $gte: now,
                  $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                },
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);

    return {
      activeMembers: insights[0].active[0]?.count || 0,
      expiredMembers: insights[0].expired[0]?.count || 0,
      expiringMembers: insights[0].expiring_soon[0]?.count || 0,
    };
  }

  // Get revenue insights
  static async getRevenueInsights() {
    const revenueData = await Member.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'plan_id',
          foreignField: '_id',
          as: 'plan_details',
        },
      },
      {
        $unwind: '$plan_details',
      },
      {
        $group: {
          _id: null,
          total_revenue: { $sum: '$plan_details.price' },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.total_revenue || 0;

    // Monthly revenue
    const monthlyRevenue = await Member.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'plan_id',
          foreignField: '_id',
          as: 'plan_details',
        },
      },
      {
        $unwind: '$plan_details',
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$plan_details.price' },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
    ]);

    return {
      totalRevenue,
      monthlyRevenue,
    };
  }

  // Get gym-wise stats
  static async getGymWiseStats() {
    const stats = await Member.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: 'gyms',
          localField: 'gym_id',
          foreignField: '_id',
          as: 'gym_details',
        },
      },
      {
        $unwind: '$gym_details',
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'plan_id',
          foreignField: '_id',
          as: 'plan_details',
        },
      },
      {
        $unwind: '$plan_details',
      },
      {
        $group: {
          _id: '$gym_id',
          gym_name: { $first: '$gym_details.name' },
          members_count: { $sum: 1 },
          revenue: { $sum: '$plan_details.price' },
        },
      },
      {
        $sort: { members_count: -1 },
      },
    ]);

    return stats;
  }

  // Get recent activity
  static async getRecentActivity() {
    const recentMembers = await Member.find({ isDeleted: false })
      .populate('gym_id')
      .populate('plan_id')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentGyms = await Gym.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      recentMembers,
      recentGyms,
    };
  }
}

module.exports = DashboardService;
