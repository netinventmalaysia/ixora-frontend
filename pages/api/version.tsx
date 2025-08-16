import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    sha: process.env.NEXT_PUBLIC_BUILD_SHA || 'unknown',
    builtAt: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'unset',
  });
}
