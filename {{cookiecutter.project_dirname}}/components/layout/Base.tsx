import NextJSProgress from 'nextjs-progressbar'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { Navbar } from '@/components/Navbar'

import { GlobalStyle } from '@/styles/GlobalStyle'
import theme from '@/styles/theme'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar />
      <NextJSProgress
        color={theme.colors.secondary[100]}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      {children}
    </ThemeProvider>
  )
}

export default Layout
