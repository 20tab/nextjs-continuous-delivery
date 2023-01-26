const express = require('express')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Robots.txt
  server.use('/robots.txt', express.static(
    path.resolve(
      __dirname,
      `./public/robots/${process.env.REACT_ENVIRONMENT || 'development'}.txt`
    )
  ))

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.info(`> Ready on http://${hostname}:${port}`)
  })
})
