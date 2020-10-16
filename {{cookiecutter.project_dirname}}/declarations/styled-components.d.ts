import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string
    text: string
    background: string
    header: {
      background: string
    }
  }
}
