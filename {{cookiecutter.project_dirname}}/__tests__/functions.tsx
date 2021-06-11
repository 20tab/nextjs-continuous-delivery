import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import React, { ReactElement } from 'react'

import { Theme } from '@/models/Utils'
import reducer from '@/store/reducers'
import themes from '@/styles/themes'

export const renderWithRedux = (ui: ReactElement) => {
  const store = configureStore({ reducer })
  render(<Provider store={store}>{ui}</Provider>)
  return store
}

export const renderWithTheme = (ui: ReactElement, theme = Theme.light) => {
  return render(<ThemeProvider theme={themes[theme]}>{ui}</ThemeProvider>)
}
