import type { NextApiRequest, NextApiResponse } from 'next/types'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(204).send('')
}
