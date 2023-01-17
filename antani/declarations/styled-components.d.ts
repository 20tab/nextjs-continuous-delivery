import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string
      header: string
      label: string
      primary: string
      secondary: string
      status: {
        error: string
        success: string
        warning: string
      }
      text: string
    }
  }
}
