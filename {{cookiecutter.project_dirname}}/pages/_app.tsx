import { ThemeProvider } from 'styled-components'
import Head from 'next/head'
import nookies from 'nookies'
import React from 'react'

import { getLoggedUser } from '@/utils/api'
import { GlobalStyle } from '@/styles/GlobalStyle'
import { login } from '@/store/userSlice'
import { setEnvs, changeTheme } from '@/store/utilsSlice'
import { Theme } from '@/models/Utils'
import { useAppSelector } from '@/utils/hooks/useAppSelector'
import { wrapper } from '@/store/'
import themes from '@/styles/themes'

function MyApp({ Component, pageProps }) {
  const theme = useAppSelector(state => state.utils.theme)
  const title = '{{ cookiecutter.project_name }}'
  const description = '{{ cookiecutter.project_description }}'
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

MyApp.getInitialProps = wrapper.getInitialPageProps(store =>
  // TODO remove any types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ Component, ctx }: any) => {
    const pageLevelInitialProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    const isServer = !!ctx.req

    if (isServer) {
      const parsedEnv = Object.keys(process.env)
        .filter(k => k.indexOf('NEXT_PUBLIC_') === 0)
        .reduce((newData, k) => {
          newData[k] = process.env[k]
          return newData
        }, {})

      store.dispatch(setEnvs(parsedEnv))

      const cookies = nookies.get(ctx)

      if (cookies.theme) {
        store.dispatch(
          changeTheme(cookies.theme === Theme.dark ? Theme.dark : Theme.light)
        )
      }

      if (cookies.sessionid) {
        try {
          const { data } = await getLoggedUser({
            serverSide: true,
            sessionId: cookies.sessionid,
            locale: ctx.locale
          })
          store.dispatch(login(data))
        } catch (error) {
          nookies.destroy(ctx, 'sessionid')
          console.error(error)
        }
      }
    }

    return {
      pageProps: { ...pageLevelInitialProps }
    }
  }
)

export default wrapper.withRedux(MyApp)
