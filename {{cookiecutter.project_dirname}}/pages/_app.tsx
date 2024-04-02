import Head from 'next/head'
import React from 'react'

import Layout from '@/components/layout/Base'

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const title = '{{ cookiecutter.project_name }}'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp
