import { Store, CombinedState, AnyAction } from 'redux'

import { iState } from '../models/State'

declare global {
  interface Window {
    store: Store<CombinedState<iState>, AnyAction>
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R
  }
}
