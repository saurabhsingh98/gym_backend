const Owner = require('../models/Owner');
const AppError = require('../utils/AppError');
const { generateToken } = require('../utils/jwtUtils');
const { uploadToCloudinary } = require('../utils/cloudinaryUtils');

class OwnerService {
  // Register owner
  static async registerOwner(ownerData, photoFile = null) {
    try {
      let photoUrl = null;

      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile.path, 'gym_management/owners');
      }

      const owner = await Owner.create({
        ...ownerData,
        photo_url: photoUrl,
      });

      const token = generateToken(owner._id);

      return {
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          address: owner.address,
          photo_url: owner.photo_url,
        },
        token,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError('Email already exists', 400);
      }
      throw error;
    }
  }

  // Login owner
  static async loginOwner(email, password) {
    const owner = await Owner.findOne({ email }).select('+password').active();

    if (!owner) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await owner.matchPassword(password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(owner._id);

    return {
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
        photo_url: owner.photo_url,
      },
      token,
    };
  }

  // Get owner profile
  static async getOwnerProfile(ownerId) {
    const owner = await Owner.findById(ownerId).active();

    if (!owner) {
      throw new AppError('Owner not found', 404);
    }

    return owner;
  }

  // Get all owners
  static async getAllOwners(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;

    const query = Owner.find({ isDeleted: false });

    if (search) {
      query.or([
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]);
    }

    const total = await Owner.countDocuments(query);
    const owners = await query.skip(skip).limit(limit);

    return {
      owners,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    };
  }

  // Update owner
  static async updateOwner(ownerId, updateData, photoFile = null) {
    let photoUrl = updateData.photo_url;

    if (photoFile) {
      photoUrl = await uploadToCloudinary(photoFile.path, 'gym_management/owners');
    }

    const owner = await Owner.findByIdAndUpdate(
      ownerId,
      { ...updateData, ...(photoFile && { photo_url: photoUrl }) },
      { new: true, runValidators: true }
    );

    if (!owner) {
      throw new AppError('Owner not found', 404);
    }

    return owner;
  }

  // Soft delete owner
  static async deleteOwner(ownerId) {
    const owner = await Owner.findByIdAndUpdate(ownerId, { isDeleted: true }, { new: true });

    if (!owner) {
      throw new AppError('Owner not found', 404);
    }

    return owner;
  }
}

module.exports = OwnerService;
