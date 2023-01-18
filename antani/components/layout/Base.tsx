import { useAppDispatch, useAppSelector } from '@/store'
import themes from '@/styles/themes'
import React, { useEffect } from 'react'

import { GlobalStyle } from '@/styles/GlobalStyle'
import { ThemeProvider } from 'styled-components'
import { parseCookies } from 'nookies'
import { Navbar } from '@/components/Navbar'
import { changeTheme } from '@/store/utilsSlice'

type Props = {
  children: React.ReactNode
}
const ThemeWrapper = ({ children }: Props) => {
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

export default ThemeWrapper
