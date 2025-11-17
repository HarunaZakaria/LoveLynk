import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 only if AWS credentials are provided
let s3: AWS.S3 | null = null;

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
  });
}

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  // If S3 is not configured, return a placeholder URL
  // In production, you should handle this differently
  if (!s3 || !process.env.AWS_S3_BUCKET) {
    console.warn('AWS S3 not configured. File upload will not work properly.');
    // Return a placeholder URL - in real app, you might want to use local storage or throw error
    return `https://placeholder.com/${folder}/${file.originalname}`;
  }

  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  try {
    await s3.upload(params).promise();
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};
