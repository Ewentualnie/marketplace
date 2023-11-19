import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    return new Promise<UploadApiResponse | UploadApiErrorResponse>(
      (resolve, reject) => {
        // console.log('in uploadFile method');

        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            // console.log('in upload_stream method');

            if (error) {
              console.error('Error uploading file to Cloudinary:', error);
              return reject(error);
            }
            // console.log('in resolve');

            resolve(result);
          },
        );
        // console.log('streamifier start');

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
        // console.log('streamifier end');
      },
    );
  }

  deleteFile(filePath: string) {
    const fileId = filePath.match(/\/([^\/?#]+)\.[^\/]*$/)[1];
    cloudinary.uploader
      .destroy(fileId)
      .then((res) =>
        console.log(`The result of deleting file ${fileId} is ${res?.result}`),
      );
  }
}
