import { HYDRATE } from 'next-redux-wrapper'

import { iState } from '../../models/State'

export * from './theme'

export interface Hydrate {
  type: typeof HYDRATE
  payload: iState
}
