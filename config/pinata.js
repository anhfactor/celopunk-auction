const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);
