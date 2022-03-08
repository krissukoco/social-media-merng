const AWS = require('aws-sdk');
require('dotenv').config();

const bucketName = process.env.AWS_S3_BUCKET;
const bucketRegion = process.env.AWS_S3_REGION;
const accessKey = process.env.AWS_S3_ACCESS_KEY;
const secretKey = process.env.AWS_S3_ACCESS_SECRET;

const config = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
};

const s3 = new AWS.S3(config);

module.exports.s3Config = config;
module.exports.s3 = s3;

module.exports.s3DefaultParams = {
  Bucket: bucketName,
};
