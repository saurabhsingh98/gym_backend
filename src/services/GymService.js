const Gym = require('../models/Gym');
const AppError = require('../utils/AppError');

class GymService {
  // Create gym
  static async createGym(gymData) {
    try {
      const gym = await Gym.create(gymData);
      return gym;
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('Gym name must be unique', 400);
      }
      throw error;
    }
  }

  // Get single gym
  static async getGym(id) {
    const gym = await Gym.findById(id).active();
    if (!gym) {
      throw new AppError('Gym not found', 404);
    }
    return gym;
  }

  // Get all gyms with pagination
  static async getAllGyms(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const query = Gym.find({ isDeleted: false });

    if (search) {
      query.or([
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ]);
    }

    const total = await Gym.countDocuments(query);
    const gyms = await query.skip(skip).limit(limit);

    return {
      gyms,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Update gym
  static async updateGym(id, updateData) {
    const gym = await Gym.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!gym) {
      throw new AppError('Gym not found', 404);
    }

    return gym;
  }

  // Soft delete gym
  static async deleteGym(id) {
    const gym = await Gym.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!gym) {
      throw new AppError('Gym not found', 404);
    }

    return gym;
  }
}

module.exports = GymService;
