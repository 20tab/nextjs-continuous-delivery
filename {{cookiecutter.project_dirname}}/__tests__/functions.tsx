import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'

import reducer from '@/store/reducers'

export const renderWithRedux = (ui: ReactElement) => {
  const store = configureStore({ reducer })
  render(<Provider store={store}>{ui}</Provider>)
  return store
}
