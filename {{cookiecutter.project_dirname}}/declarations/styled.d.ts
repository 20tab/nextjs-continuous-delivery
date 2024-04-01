import 'styled-components'

import type theme from '@/styles/theme/light'

type Theme = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
