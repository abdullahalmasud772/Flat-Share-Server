import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as fs from "fs";
import { ICloudinaryResponse, IUploadFile } from "../interfaces/file";
import config from "../config";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_cloud_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: async (req, file) => {
    let base = "flatshare";

    if (req.originalUrl.includes("user")) {
      base = "flatshare/user";
    } else if (req.originalUrl.includes("flat")) {
      base = `flatshare/flat`;
    }

    const fileName = file.originalname
      .split(".")[0]
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");
    return {
      folder: base,
      allowed_formats: ["jpeg", "png", "jpg", "webp"],
      public_id: `${Date.now()}-${fileName}`,
      resource_type: "image",
    };
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IUploadFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file.path);
        // if (fs.existsSync(file.path)) {
        //   fs.unlinkSync(file.path);
        // }
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};

/// when devlopment mode use local storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
