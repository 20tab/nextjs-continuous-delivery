import { theme as lightTheme } from '@/styles/themes/light'

import type { DefaultTheme } from 'styled-components'

const theme: DefaultTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    ui1: '#1C1C1C',
    ui2: '#333333',
    ui3: '#696D73',
    ui4: '#A6B0BB',
    ui5: '#E5E8EB',
    ui6: '#E0EAEF',
    ui7: '#EDF8FF',
    ui8: '#F1F9FF',
    neutrals: {
      0: '#000000',
      100: '#F4F7F8',
      200: '#D2D7DA',
      300: '#B3B9BD',
      400: '#949CA1',
      500: '#777F86',
      600: '#404952'
    }
  }
}

export { theme }
