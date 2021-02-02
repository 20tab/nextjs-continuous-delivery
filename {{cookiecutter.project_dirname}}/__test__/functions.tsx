import React, { ReactElement } from 'react'
import { createStore, Store } from 'redux'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'

import reducers from '../store/reducers'

export const renderWithRedux = (ui: ReactElement, initialState = {}): Store => {
  const store = createStore(reducers, initialState)

  render(
    <Provider store={store}>
      {ui}
    </Provider>
  )

  return store
}
