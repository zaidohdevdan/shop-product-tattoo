import { request } from 'https';
import { stringify } from 'querystring';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const presetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !apiKey || !apiSecret || !presetName) {
  console.error("Missing credentials in env");
  process.exit(1);
}

const url = `https://${apiKey}:${apiSecret}@api.cloudinary.com/v1_1/${cloudName}/upload_presets/${presetName}`;

const postData = stringify({
  background_removal: 'cloudinary_ai',
  eager: 'c_pad,w_1080,h_1080,b_black,q_auto,f_auto' // The transformation desired by user
});

const req = request(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(data);
  });
});

req.on('error', e => console.error(e));
req.write(postData);
req.end();
