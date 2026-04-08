const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Plan price is required'],
      min: [0, 'Price cannot be negative'],
    },
    validity: {
      type: Number,
      required: [true, 'Plan validity (in days) is required'],
      min: [1, 'Validity must be at least 1 day'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Apply query filter to exclude soft-deleted records
planSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model('Plan', planSchema);
