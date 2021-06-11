import { Store, CombinedState, AnyAction } from 'redux'

import { AppState } from '@/store/store'

declare global {
  interface Window {
    __NEXT_REDUX_WRAPPER_STORE__: Store<CombinedState<AppState>, AnyAction>
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <R>(a: R) => R
  }
}
