const GymOwnerMapping = require('../models/GymOwnerMapping');
const AppError = require('../utils/AppError');

class GymOwnerMappingService {
  // Create mapping
  static async createMapping(mappingData) {
    try {
      const mapping = await GymOwnerMapping.create(mappingData);
      return mapping;
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('This mapping already exists', 400);
      }
      throw error;
    }
  }

  // Get mapping
  static async getMapping(id) {
    const mapping = await GymOwnerMapping.findById(id)
      .populate('gym_id')
      .populate('owner_id')
      .active();

    if (!mapping) {
      throw new AppError('Mapping not found', 404);
    }

    return mapping;
  }

  // Get all mappings for an owner
  static async getMappingsByOwner(ownerId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await GymOwnerMapping.countDocuments({
      owner_id: ownerId,
      isDeleted: false,
    });

    const mappings = await GymOwnerMapping.find({
      owner_id: ownerId,
      isDeleted: false,
    })
      .populate('gym_id')
      .populate('owner_id')
      .skip(skip)
      .limit(limit);

    return {
      mappings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Get all mappings for a gym
  static async getMappingsByGym(gymId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await GymOwnerMapping.countDocuments({
      gym_id: gymId,
      isDeleted: false,
    });

    const mappings = await GymOwnerMapping.find({
      gym_id: gymId,
      isDeleted: false,
    })
      .populate('gym_id')
      .populate('owner_id')
      .skip(skip)
      .limit(limit);

    return {
      mappings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Delete mapping
  static async deleteMapping(id) {
    const mapping = await GymOwnerMapping.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!mapping) {
      throw new AppError('Mapping not found', 404);
    }

    return mapping;
  }
}

module.exports = GymOwnerMappingService;
