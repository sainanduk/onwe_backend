const multer = require('multer');

// Function to create multer upload middleware
const createMulterUpload = () => {
  // Set up Multer storage
  const storage = multer.memoryStorage();

  // Create multer upload instance
  const upload = multer({ storage: storage });

  // Middleware to handle file uploads
  const uploadimages = upload.array('media', 5); // 'media' should match the name attribute in your form input and 5 is the max number of files allowed

  return uploadimages;
};

module.exports = createMulterUpload;
