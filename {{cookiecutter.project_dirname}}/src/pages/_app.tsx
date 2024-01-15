import { Provider } from 'react-redux'
import Head from 'next/head'
import React from 'react'

import store from '@/src/store'

import Layout from '@/src/components/layout/Base'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const title = '{{ cookiecutter.project_name }}'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}

export default MyApp
