const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    photo_url: {
      type: String,
    },
    gym_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: [true, 'Gym ID is required'],
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: [true, 'Plan ID is required'],
    },
    plan_start_date: {
      type: Date,
      required: [true, 'Plan start date is required'],
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual for plan expiry date
memberSchema.virtual('plan_expiry_date').get(function () {
  if (this.plan_start_date && this.populate) {
    const expiryDate = new Date(this.plan_start_date);
    if (this.plan_id && this.plan_id.validity) {
      expiryDate.setDate(expiryDate.getDate() + this.plan_id.validity);
    }
    return expiryDate;
  }
  return null;
});

// Apply query filter to exclude soft-deleted records
memberSchema.query.active = function () {
  return this.where({ isDeleted: false });
};

memberSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema);
