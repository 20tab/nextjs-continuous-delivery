import { theme as lightTheme } from '@/styles/themes/light'

import type { DefaultTheme } from 'styled-components'

const theme: DefaultTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors
  }
}

export { theme }
