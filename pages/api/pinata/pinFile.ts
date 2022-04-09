import pinataClient from '@pinata/sdk';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const pinata = pinataClient(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
  );

  /**Pin file to IPFS*/
  const form = new formidable.IncomingForm();
  form.uploadDir = './';
  form.keepExtensions = true;

  await form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      res.status(400).json({ success: false });
      return;
    }
    const readableStreamForFile = fs.createReadStream(files.file.filepath);
    const result = await pinata.pinFileToIPFS(readableStreamForFile, {
      pinataMetadata: { name: files.file.originalFilename },
    });
    res.status(200).json(result);
    return;
  });
}
