import { DefaultTheme } from 'styled-components'
import { theme as lightTheme } from '@/styles/themes/light'

const theme: DefaultTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#22201f',
    header: '#373534',
    primary: '#ffffff',
    text: '#ffffff'
  }
}

export { theme }
