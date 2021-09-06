import { Theme } from '@/models/Utils'
import { theme as light } from '@/styles/themes/light'
import { theme as dark } from '@/styles/themes/dark'

const theme = {
  [Theme.light]: light,
  [Theme.dark]: dark
}

export default theme
