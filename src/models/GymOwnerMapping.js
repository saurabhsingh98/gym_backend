const mongoose = require('mongoose');

const gymOwnerMappingSchema = new mongoose.Schema(
  {
    gym_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Gym ID is required'],
    },
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: [true, 'Owner ID is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a compound unique index
gymOwnerMappingSchema.index({ gym_id: 1, owner_id: 1 }, { unique: true, sparse: true });

// Apply query filter to exclude soft-deleted records
gymOwnerMappingSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model('GymOwnerMapping', gymOwnerMappingSchema);
