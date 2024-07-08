const processimages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.mediaData = []; // Initialize as an empty array if no files are uploaded
    } else {
      const files = req.files;
      req.mediaData = [];

      for (const file of files) {
        req.mediaData.push({
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          base64String: file.buffer.toString('base64')
        });
      }
    }
    next();
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({ message: 'Error processing images' });
  }
};

module.exports = processimages;
