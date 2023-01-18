import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import Head from 'next/head'
import nookies from 'nookies'
import React from 'react'

import { GlobalStyle } from '@/styles/GlobalStyle'
import store from '@/store'
import themes from '@/styles/themes'
import { Theme } from '@/models/Utils'
import Layout from '@/components/layout/base'

function MyApp({ Component, pageProps, theme }) {
  const title = '{{ cookiecutter.project_name }}'

  return (
    <ThemeProvider theme={themes[theme || Theme.light]}>
      <Head>
        <title>{title}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <GlobalStyle />
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ThemeProvider>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageLevelInitialProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}

  const cookies = nookies.get(ctx)

  return {
    pageProps: { ...pageLevelInitialProps },
    theme: cookies['THEME']
  }
}

export default MyApp
