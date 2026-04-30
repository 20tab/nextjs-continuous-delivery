import Head from 'next/head'
import React from 'react'

import type { AppProps } from 'next/app'

import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  const title = '{{ cookiecutter.project_name }}'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
