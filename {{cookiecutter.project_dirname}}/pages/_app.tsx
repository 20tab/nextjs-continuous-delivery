import React from 'react'
import Head from 'next/head'
import { AppContext } from 'next/app'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { END } from 'redux-saga'

import { GlobalStyle } from '../styles/GlobalStyle'
import { iState } from '../models/State'
import { iTheme } from '../models/Theme'
import { SagaStore, wrapper } from '../store/store'
import themes from '../styles/themes'

function MyApp ({ Component, pageProps }) {
  const theme = useSelector<iState, iTheme>(state => state.theme)
  const title = '{{cookiecutter.project_slug}}'
  const description = 'Descrizione {{cookiecutter.project_slug}}'

  return (
    <ThemeProvider theme={themes[theme]}>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta key='og:title' property='og:title' content={title} />
        <meta key='og:description' property='og:description' content={description} />
        <meta key='og:site_name' property='og:site_name' content={title} />
        <meta property='fb:app_id' content='FB_APP_ID' />
        <meta property='og:image' content='https://www.mywebsite.it/share.png' />
        <meta property='og:url' content='https://www.mywebsite.it/' />
        <meta property='og:type' content='article' />
        <meta name='twitter:card' content='mywebsite_share_image' />
        <meta name='twitter:image:alt' content='mywebsite' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageLevelInitialProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}

  if (ctx.req) {
    ctx.store.dispatch(END)
    await (ctx.store as SagaStore).sagaTask.toPromise()
  }

  return {
    pageProps: { ...pageLevelInitialProps }
  }
}

export default wrapper.withRedux(MyApp)
