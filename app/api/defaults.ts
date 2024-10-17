import Particulars from '../../model/particulars';
import Overrides from '../../model/overrides';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { reset: resetParticulars } = Particulars();
    const { reset: resetOverrides } = Overrides();

    await resetOverrides();
    await resetParticulars();

    res.status(200).send('OK');
  }
}

export async function reset() {
    return await Promise.all([
        Particulars().resetParticulars(),
        Overrides().resetOverrides()
    ])
}
