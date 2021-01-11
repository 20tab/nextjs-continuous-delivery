import { HYDRATE } from 'next-redux-wrapper'

import { ActionsTypes } from '../actions/types'
import { iTheme } from '../../models/Theme'
import * as T from '../actions/theme/types'

export type iThemeState = iTheme

const INITIAL_STATE: iThemeState = iTheme.light

const reducer = (state = INITIAL_STATE, action: ActionsTypes): iThemeState => {
  switch (action.type) {
    case HYDRATE:
      return action.payload.theme

    case T.CHANGE_THEME:
      return action.payload

    default:
      return state
  }
}

export default reducer
