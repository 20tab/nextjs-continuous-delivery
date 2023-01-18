import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import React from 'react'

import themes from '@/styles/themes'
import store from '@/store'

import type { ReactElement } from 'react'

const defaultStore = store

import type { configureStore as configureStoreType } from '@reduxjs/toolkit'

export const renderWithWrappers = (
  element: ReactElement,
  store?: ReturnType<typeof configureStoreType>
) => {
  return render(
    <ThemeProvider theme={themes.light}>
      <Provider store={store || defaultStore}>{element}</Provider>
    </ThemeProvider>
  ).container
}
