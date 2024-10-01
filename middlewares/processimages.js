const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the MinIO client
const minioClient = new Minio.Client({
  endPoint: 'datab1.onwe.in',
  useSSL: true,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});

// Bucket name
const bucketName = "bucket-test";

async function processimages(req, res, next) {
  req.mediaData = [];

  try {
    if (!req.files || req.files.length === 0) {
      next();
      return;
    }
    const mediaPromises = req.files.map(async file => {
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
    });

    await Promise.all(mediaPromises);

    console.log("req media data", req.mediaData);
    next();
  } catch (err) {
    console.error("Error processing images", err);
    res.status(500).send("Error processing images");
  }
}

module.exports = processimages;
