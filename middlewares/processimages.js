// const processimages = async (req, res, next) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       req.mediaData = []; 
//     } else {
//       const files = req.files;
//       req.mediaData = [];
      
//       for (const file of files) {
//         req.mediaData.push({
//           filename: file.originalname,
//           mimetype: file.mimetype,
//           size: file.size,
//           base64String: file.buffer.toString('base64')
//         });
//       }
//     }
//     next();
//   } catch (error) {
//     console.error('Error processing images:', error);
//     res.status(500).json({ message: 'Error processing images' });
//   }
// };

const Minio = require('minio');
const { v4: uuidv4 } = require('uuid'); // For generating unique object names
dotenv = require('dotenv');
dotenv.config();

// Initialize the MinIO client
const client = new Minio.Client({
  endPoint: process.env.BUCKET_END_POINT,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  useSSL: true
});
33
// Bucket name
const bucketName = "testritu";

const processimages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.mediaData = [];
      next();
      return;
    }
    
    const files = req.files;
    req.mediaData = [];
    console.log("Received files");

    // Check if bucket exists, and create if not
    const bucketExists = await client.bucketExists(bucketName);
    console.log(`Bucket exists: ${bucketExists}`);
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      await client.makeBucket(bucketName);
    }

    // Process each file
    for (const file of files) {
      const objectName = uuidv4() + '-' + Date.now() + '-' + file.originalname;
      console.log(`Uploading file: ${objectName}`);

      await client.putObject(bucketName, objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype
      });

      console.log("Uploaded file:", objectName);
      
      // Generate presigned URL
      const expiration = 10 * 365 * 24 * 60 * 60; // 10 years
      const presignedUrl = await client.presignedGetObject(bucketName, objectName, expiration);
      console.log("Received presigned URL:", presignedUrl);

      // Add URL to response data
      req.mediaData.push({
        base64String: presignedUrl
      });
    }

    next();
  } catch (error) {
    console.error('Error processing and uploading images:', error);
    res.status(500).json({ message: 'Error processing and uploading images' });
  }
};

module.exports = processimages;
