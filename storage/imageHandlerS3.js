const { v4: uuid } = require('uuid');
const { extname } = require('path');

const { s3, s3DefaultParams } = require('./s3');

module.exports.uploadImageS3 = async (filePromises) => {
  let images = [];
  let success = false;
  let files = [];

  await Promise.all(filePromises.map((p) => p.promise)).then(
    (values) => (files = values)
  );

  console.log('FILES AWAIT: ', files);

  for (let file of files) {
    console.log(file);
    const { createReadStream, filename, mimetype, encoding } = file;

    try {
      const stream = createReadStream();
      const s3Result = await s3
        .upload({
          ...s3DefaultParams,
          Body: stream,
          Key: `${uuid()}${extname(filename)}`,
          ContentType: mimetype,
        })
        .promise();
      console.log('S3 Result: ', s3Result);

      const image = {
        filename,
        mimetype,
        encoding,
        url: s3Result.Location,
      };

      images.push(image);
    } catch (error) {
      console.log('Error uploadImage: ', error.message);
      success = false;
      images = [];
      return { success, images };
    }
  }
  console.log('Images final: ', images);

  // Make sure ALL IMAGES are successfully uploaded
  if (images.length == filePromises.length) {
    success = true;
  }
  console.log('imageHandlerS3 return: ', { success, images });
  return { success, images };
};
