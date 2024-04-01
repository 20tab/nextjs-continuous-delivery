import { render } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import theme from '@/styles/theme'

import type { ReactElement } from 'react'

export const renderWithWrappers = (element: ReactElement) => {
  return render(<ThemeProvider theme={theme}>{element}</ThemeProvider>)
    .container
}
