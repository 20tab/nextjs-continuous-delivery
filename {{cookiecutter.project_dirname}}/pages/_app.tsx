import { Provider } from 'react-redux'
import Head from 'next/head'
import React from 'react'

import store from '@/store'

import Layout from '@/components/layout/Base'

function MyApp({ Component, pageProps }) {
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
