import type { NextApiRequest, NextApiResponse } from 'next/types'

const getRobotsText = ({
  environment,
  url
}: {
  environment: string
  url: string
}): string => {
  return environment === 'production'
    ? `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow: /admin
Allow: /

Sitemap: ${url}/sitemap.xml
`
    : `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow: /

Sitemap: ${url}/sitemap.xml
`
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const text = getRobotsText({
    environment: process?.env?.REACT_ENVIRONMENT || 'development',
    url: process?.env?.PROJECT_URL || ''
  })
  res.setHeader('Content-Type', 'text/plain')
  res.send(text)
}
