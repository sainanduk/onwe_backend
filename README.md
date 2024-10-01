just to check ci/cd pipeline



const processimages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.mediaData = [];
      return next();  // Continue if no files are provided
    }
    
    const files = req.files;
    req.mediaData = [];

    // Check if the bucket exists, and create if not
    const bucketExists = await client.bucketExists(bucketName);
    if (!bucketExists) {
      await client.makeBucket(bucketName);
      console.log(`Bucket ${bucketName} created`);
    }

    // Process and upload each file
    for (const file of files) {
      const objectName = `${uuidv4()}-${Date.now()}-${file.originalname}`;
      console.log(`Uploading file: ${objectName}`);

      // Upload the file from the buffer
      await client.putObject(bucketName, objectName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
      });

      console.log(`File uploaded: ${objectName}`);
      
      // Generate presigned URL (10 years expiration)
      const expiration = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
      const presignedUrl = await client.presignedGetObject(bucketName, objectName, expiration);

      // Add presigned URL to mediaData
      req.mediaData.push({
        filename: file.originalname,
        url: presignedUrl,
      });
    }

    next();  // Pass to the next middleware
  } catch (error) {
    console.error('Error processing and uploading images:', error);
    res.status(500).json({ message: 'Error processing and uploading images' });
  }
};
