import { iTheme } from '../../../models/Theme'
import * as T from './types'

export const changeTheme = (theme: iTheme): T.ChangeTheme => ({
  type: T.CHANGE_THEME,
  payload: theme
})
