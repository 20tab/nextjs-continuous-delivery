import { iTheme } from '../../../models/Theme'

export const CHANGE_THEME = 'CHANGE_THEME'

export interface ChangeTheme {
  type: typeof CHANGE_THEME
  payload: iTheme
}

export type ThemeActionsTypes = ChangeTheme
