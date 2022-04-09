import pinataClient from '@pinata/sdk';

export default async function handler(req, res) {
  const { body } = req;

  const pinata = pinataClient(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
  );

  /**Unpin file in Pinata*/
  try {
    const { hash } = body;
    await pinata.unpin(hash);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
}
