import pinataClient from '@pinata/sdk';

export default async function handler(req, res) {
  const pinata = pinataClient(
    process.env.PINATA_API_KEY,
    process.env.PINATA_API_SECRET
  );

  /**Test pinata AUTH */
  try {
    const result = await pinata.testAuthentication();
    console.log(result);
    res.status(200).json({ sucesss: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
}
