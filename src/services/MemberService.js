const Member = require('../models/Member');
const Plan = require('../models/Plan');
const AppError = require('../utils/AppError');
const { uploadToCloudinary } = require('../utils/cloudinaryUtils');

class MemberService {
  // Create member
  static async createMember(memberData, photoFile = null) {
    try {
      let photoUrl = null;

      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile.path, 'gym_management/members');
      }

      const member = await Member.create({
        ...memberData,
        photo_url: photoUrl,
      });

      return member.populate(['gym_id', 'plan_id']);
    } catch (error) {
      throw error;
    }
  }

  // Get member
  static async getMember(id) {
    const member = await Member.findById(id)
      .populate('gym_id')
      .populate('plan_id')
      .active();

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    return member;
  }

  // Get all members with pagination and search
  static async getAllMembers(page = 1, limit = 10, search = '', gymId = null) {
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };

    if (gymId) {
      query.gym_id = gymId;
    }

    let memberQuery = Member.find(query);

    if (search) {
      memberQuery = Member.find({
        ...query,
        $or: [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }],
      });
    }

    const total = await Member.countDocuments(
      search
        ? {
            ...query,
            $or: [{ name: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }],
          }
        : query
    );

    const members = await memberQuery
      .populate('gym_id')
      .populate('plan_id')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      members,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Update member
  static async updateMember(id, updateData, photoFile = null) {
    let photoUrl = updateData.photo_url;

    if (photoFile) {
      photoUrl = await uploadToCloudinary(photoFile.path, 'gym_management/members');
    }

    const member = await Member.findByIdAndUpdate(
      id,
      { ...updateData, ...(photoFile && { photo_url: photoUrl }) },
      { new: true, runValidators: true }
    ).populate(['gym_id', 'plan_id']);

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    return member;
  }

  // Soft delete member
  static async deleteMember(id) {
    const member = await Member.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).populate([
      'gym_id',
      'plan_id',
    ]);

    if (!member) {
      throw new AppError('Member not found', 404);
    }

    return member;
  }

  // Get members with expiring plans (within 7 days)
  static async getMembersWithExpiringPlans(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const members = await Member.aggregate([
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
        $match: {
          plan_expiry_date: {
            $gte: now,
            $lte: sevenDaysLater,
          },
        },
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
        $sort: { plan_expiry_date: 1 },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = members[0];
    const total = data.total.length > 0 ? data.total[0].count : 0;

    return {
      members: data.data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Get active members
  static async getActiveMembers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const now = new Date();

    const members = await Member.aggregate([
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
        $match: {
          plan_expiry_date: { $gt: now },
        },
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
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = members[0];
    const total = data.total.length > 0 ? data.total[0].count : 0;

    return {
      members: data.data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Get expired members
  static async getExpiredMembers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const now = new Date();

    const members = await Member.aggregate([
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
        $match: {
          plan_expiry_date: { $lt: now },
        },
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
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const data = members[0];
    const total = data.total.length > 0 ? data.total[0].count : 0;

    return {
      members: data.data,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }
}

module.exports = MemberService;
