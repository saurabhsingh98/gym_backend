const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Gym name is required'],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Gym address is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Apply query filter to exclude soft-deleted records
gymSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model('Gym', gymSchema);
