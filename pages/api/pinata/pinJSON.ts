import pinataClient from '@pinata/sdk';

export default async function handler(req, res) {
  const { body } = req;

  const pinata = pinataClient(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
  );

  /**Pin file to IPFS*/
  try {
    const result = await pinata.pinJSONToIPFS(body, {
      pinataMetadata: { name: body.name },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
}
