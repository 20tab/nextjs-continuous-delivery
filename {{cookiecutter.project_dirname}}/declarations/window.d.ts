import { Store, CombinedState, AnyAction } from 'redux'

import { State } from '@/models/State'

declare global {
  interface Window {
    __NEXT_REDUX_WRAPPER_STORE__: Store<CombinedState<State>, AnyAction>
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R
  }
}
