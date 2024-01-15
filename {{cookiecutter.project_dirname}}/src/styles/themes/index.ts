import { Theme } from '@/src/models/Utils'
import { theme as light } from '@/src/styles/themes/light'
import { theme as dark } from '@/src/styles/themes/dark'

const theme = {
  [Theme.light]: light,
  [Theme.dark]: dark
}

export default theme
