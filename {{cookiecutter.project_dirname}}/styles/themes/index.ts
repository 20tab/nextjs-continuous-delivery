import { Theme } from '../../models/Theme'
import { theme as light } from './light'
import { theme as dark } from './dark'

export default {
  [Theme.light]: light,
  [Theme.dark]: dark
}
