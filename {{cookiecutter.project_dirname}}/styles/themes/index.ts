import { iTheme } from '../../models/Theme'
import { theme as light } from './light'
import { theme as dark } from './dark'

export default {
  [iTheme.light]: light,
  [iTheme.dark]: dark
}
