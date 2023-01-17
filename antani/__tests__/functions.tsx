import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import React, { ReactElement } from 'react'

import themes from '@/styles/themes'
import { makeStore } from '@/store'

export const store = makeStore()

export const renderWithReduxAndTheme = (element: ReactElement) => {
  return render(
    <ThemeProvider theme={themes[store.getState().utils.theme]}>
      <Provider store={store}>{element}</Provider>
    </ThemeProvider>
  ).container
}
