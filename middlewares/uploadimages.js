const multer = require('multer');

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Middleware to handle file uploads
const uploadimages = upload.array('media', 5); // 'media' should match the name attribute in your form input and 5 is the max number of files allowed

module.exports = uploadimages;

