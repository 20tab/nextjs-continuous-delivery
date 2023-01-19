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
      100: '#404952',
      200: '#777F86',
      300: '#949CA1',
      400: '#B3B9BD',
      500: '#D2D7DA',
      600: '#F4F7F8'
    }
  }
}

export { theme }
