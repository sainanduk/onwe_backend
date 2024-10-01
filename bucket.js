const Minio = require('minio');
const fs = require('fs');
const path = require('path');

// Initialize the MinIO client
const client = new Minio.Client({
    endPoint: 'datab1.onwe.in',
    useSSL: true,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

// Bucket and file details
const bucketName = 'bucket-test';
const imagePath = 'cattt.jpg'; // Path to the image you want to upload
const objectName = path.basename(imagePath); // Object name in the bucket

async function uploadAndGenerateLink() {
    try {
        // Check if the bucket exists, create if not
        const bucketExists = await client.bucketExists(bucketName);
        if (!bucketExists) {
            await client.makeBucket(bucketName);
            console.log(`Bucket ${bucketName} created successfully`);
        }

        // Upload the image
        await client.fPutObject(bucketName, objectName, imagePath);
        console.log(`Image uploaded successfully to ${bucketName}/${objectName}`);

        // Generate a public link with expiration
        const expiration = 24 * 60 * 60; // 24 hours in seconds
        const url = await client.presignedGetObject(bucketName, objectName, expiration);
        console.log(`Public link: ${url}`);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

uploadAndGenerateLink();