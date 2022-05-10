import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext
} from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App =>
            function renderPage(props) {
              return sheet.collectStyles(<App {...props} />)
            }
        })

      const initialProps = await Document.getInitialProps(ctx)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const styles: any = (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      )

      return {
        ...initialProps,
        styles: styles
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
