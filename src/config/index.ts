import dotenv from "dotenv";
import path from "path";

const envPath =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), ".env.prod")
    : path.join(process.cwd(), ".env");

dotenv.config({ path: envPath });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_secret_expires_in: process.env.JWT_SECRET_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_secret_expires_in: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
  },
  reset_pass: {
    reset_pass_secret: process.env.RESET_PASS_SECRET,
    reset_pass_secret_expires_in: process.env.RESET_PASS_SECRET_EXPIRES_IN,
    reset_pass_link: process.env.RESET_PASS_LINK,
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  bycrypt_salt_rounds: process.env.BYCRYPT_SALT_ROUNDS,
  ssl: {
    ssl_store_id: process.env.SSL_STORE_ID,
    ssl_store_passwd: process.env.SSL_STORE_PASSWD,
    ssl_success_url: process.env.SSL_SUCCESS_URL,
    ssl_fail_url: process.env.SSL_FAIL_URL,
    ssl_cancel_url: process.env.SSL_CANCEL_URL,
    ssl_ipn_url:process.env.SSL_IPN_URL,
    ssl_payment_url: process.env.SSL_PAYMENT_URL,
    ssl_validation_api: process.env.SSL_VALIDATION_API,
  },
  cloudinary: {
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
