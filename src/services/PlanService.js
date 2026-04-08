const Plan = require('../models/Plan');
const AppError = require('../utils/AppError');

class PlanService {
  // Create plan
  static async createPlan(planData) {
    try {
      const plan = await Plan.create(planData);
      return plan;
    } catch (error) {
      throw error;
    }
  }

  // Get plan
  static async getPlan(id) {
    const plan = await Plan.findById(id).active();

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    return plan;
  }

  // Get all plans
  static async getAllPlans(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const query = Plan.find({ isDeleted: false });

    if (search) {
      query.where('name').regex(search, 'i');
    }

    const total = await Plan.countDocuments(query);
    const plans = await query.skip(skip).limit(limit);

    return {
      plans,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Update plan
  static async updatePlan(id, updateData) {
    const plan = await Plan.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    return plan;
  }

  // Soft delete plan
  static async deletePlan(id) {
    const plan = await Plan.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!plan) {
      throw new AppError('Plan not found', 404);
    }

    return plan;
  }
}

module.exports = PlanService;
