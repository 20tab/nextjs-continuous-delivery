import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { MakeStore, createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware from 'redux-saga'

import { State } from '../models/State'
import reducers from './reducers'
import sagas from '../sagas'

// TODO Fix any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeStore: MakeStore<State> = (context: any) => {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore<State>({
    reducer: reducers,
    middleware: ([
      ...getDefaultMiddleware({ thunk: false }),
      sagaMiddleware
      // TODO Fix any type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any),
    devTools: process.env.NODE_ENV === 'development'
  })

  sagaMiddleware.run(sagas, context.ctx)

  return store
}

export const wrapper = createWrapper<State>(makeStore, {
  debug: false
})
