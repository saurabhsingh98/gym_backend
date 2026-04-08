const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder = 'gym_management') => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });

    // Delete local file after successful upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    // Delete local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
