const express = require('express')
const next = require('next')
const auth = require('basic-auth')
const path = require('path')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Basic auth
  if ((
    process.env.REACT_ENVIRONMENT === 'Development' ||
    process.env.REACT_ENVIRONMENT === 'Integration' ||
    process.env.REACT_ENVIRONMENT === 'Production') &&
    process.env.BASIC_AUTH_USER &&
    process.env.BASIC_AUTH_PASSWORD
  ) {
    server.use(function (req, res, next) {
      const credentials = auth(req)

      if (!credentials ||
        credentials.name !== process.env.BASIC_AUTH_USER ||
        credentials.pass !== process.env.BASIC_AUTH_PASSWORD
      ) {
        res.status(401)
        res.header('WWW-Authenticate', 'Basic realm="MyRealm"')
        res.send('Access denied')
      } else {
        next()
      }
    })
  }

  // Robots.txt
  server.use('/robots.txt', express.static(
    path.resolve(
      __dirname,
      `./public/robots/${(process.env.REACT_ENVIRONMENT || 'development').toLowerCase()}.txt`
    )
  ))

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
