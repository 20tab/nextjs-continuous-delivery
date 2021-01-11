import { createStore, applyMiddleware, compose, Store } from 'redux'
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper'
import createSagaMiddleware, { Task } from 'redux-saga'

import { iState } from '../models/State'
import reducers from './reducers'
import sagas from '../sagas'

export interface SagaStore extends Store {
  sagaTask?: Task;
}

const makeStore: MakeStore<iState> = (context: Context) => {
  const sagaMiddleware = createSagaMiddleware()
  const composeEnhancers = process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose

  const enhancers = composeEnhancers(applyMiddleware(sagaMiddleware))
  const store = createStore(reducers, enhancers)
  if (typeof window !== 'undefined') window.store = store;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (store as SagaStore).sagaTask = sagaMiddleware.run(sagas, (context as any).ctx)

  return store
}

export const wrapper = createWrapper<iState>(makeStore, {
  debug: false
})
