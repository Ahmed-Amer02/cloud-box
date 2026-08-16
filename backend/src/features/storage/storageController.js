import * as storageService from './storageService.js';

export const getStorageUsage = async (req, res) => {
  try {
    const userId = req.user.id;

    const usage = await storageService.getStorageUsage(userId);

    return res.status(200).json({
      success: true,
      data: usage,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
