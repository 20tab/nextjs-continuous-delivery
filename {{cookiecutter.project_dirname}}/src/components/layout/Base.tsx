import { parseCookies } from 'nookies'
import { ThemeProvider } from 'styled-components'
import React, { useEffect } from 'react'

import { changeTheme } from '@/src/store/utilsSlice'
import { GlobalStyle } from '@/src/styles/GlobalStyle'
import { Navbar } from '@/src/components/Navbar'
import { useAppDispatch, useAppSelector } from '@/src/store'
import themes from '@/src/styles/themes'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector(state => state.utils)

  useEffect(() => {
    const cookie = parseCookies()
    if (cookie['THEME'] !== theme) {
      dispatch(changeTheme(cookie['THEME']))
    }
  }, [dispatch, theme])

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      <Navbar />
      {children}
    </ThemeProvider>
  )
}

export default Layout
