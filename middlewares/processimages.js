const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.BUCKET_END_POINT,
  useSSL: true,
  accessKey: process.env.BUCKET_ACCESS_KEY,
  secretKey: process.env.BUCKET_SECRET_KEY,
});

// Bucket name
const bucketName = process.env.BUCKET_NAME;

async function processimages(req, res, next) {
  req.mediaData = [];
  
  
  try {
    if (!req.files || req.files.length === 0) {
      next();
      return;
    }
    
    for (const file of req.files) {
      const buffer = file.buffer;
      const mimeType = file.mimetype;
      const imgName = `${uuidv4()}-${Date.now()}-${file.originalname}`;

      // Upload file to MinIO
      await minioClient.putObject(bucketName, imgName, buffer, {
        'Content-Type': mimeType,
      });

      // Generate static URL for public access and include MIME type as query parameter
      const staticUrl = `https://datab1.onwe.in/${bucketName}/${imgName}?mimeType=${encodeURIComponent(mimeType)}`;
      req.mediaData.push({ base64String: staticUrl });
    }

    console.log("req media data", req.mediaData);
    next();
  } catch (err) {
    console.error("Error processing images", err);
    res.status(500).send("Error processing images");
  }
}

module.exports = processimages;
