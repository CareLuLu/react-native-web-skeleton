import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

function parseBoolean(text) {
  if (text && text.toLowerCase() === 'true') {
    return true;
  }
  if (text && text.toLowerCase() === 'false') {
    return false;
  }
  if (parseInt(text, 10)) {
    return true;
  }
  return false;
}

const config = {
  environment: process.env.NODE_ENV || 'development',
  api: {
    host: process.env.NODE_HOST || 'localhost',
    port: process.env.NODE_PORT || 3000,
    locale: process.env.LOCALE || 'en-US',
    https: parseBoolean(process.env.HTTPS),
    httpsOptions: {
      key: !process.env.SSL_KEY_FILE ? null : fs.readFileSync(
        path.resolve(process.cwd(), process.env.SSL_KEY_FILE),
        'utf8',
      ).toString(),
      cert: !process.env.SSL_CRT_FILE ? null : fs.readFileSync(
        path.resolve(process.cwd(), process.env.SSL_CRT_FILE),
        'utf8',
      ).toString(),
    },
  },
  auth: {
    username: process.env.AUTH_USERNAME,
    password: process.env.AUTH_PASSWORD,
  },
};

export default config;
