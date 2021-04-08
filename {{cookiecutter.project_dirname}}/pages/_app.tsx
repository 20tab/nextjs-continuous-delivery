import React from 'react'
import Head from 'next/head'
import { AppContext } from 'next/app'
import { useSelector } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import nookies from 'nookies'

import { changeTheme } from '@/store/themeSlice'
import { GlobalStyle } from '@/styles/GlobalStyle'
import { State } from '@/models/State'
import { Theme } from '@/models/Theme'
import { wrapper } from '@/store/store'
import themes from '@/styles/themes'

function MyApp({ Component, pageProps }) {
  const theme = useSelector<State, Theme>(state => state.ui.theme)
  const title = '{{cookiecutter.project_slug}}'
  const description = 'Descrizione {{cookiecutter.project_slug}}'
  const shareImage = 'https://www.mywebsite.it/share.png'
  const descKey = 'og:description'

  return (
    <ThemeProvider theme={themes[theme]}>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta key='og:title' property='og:title' content={title} />
        <meta key={descKey} property={descKey} content={description} />
        <meta key='og:site_name' property='og:site_name' content={title} />
        <meta property='fb:app_id' content='FB_APP_ID' />
        <meta property='og:image' content={shareImage} />
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

  const isServer = !!ctx

  if (isServer) {
    const cookies = nookies.get(ctx)

    if (cookies.theme) {
      ctx.store.dispatch(
        changeTheme(cookies.theme === Theme.dark ? Theme.dark : Theme.light)
      )
    }
  }

  return {
    pageProps: { ...pageLevelInitialProps }
  }
}

export default wrapper.withRedux(MyApp)
