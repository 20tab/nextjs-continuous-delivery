import 'styled-components'

type Shade = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

type Palette = {
  [key in Partial<Shade>]?: string
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      ui1: string
      ui2: string
      ui3: string
      ui4: string
      ui5: string
      ui6: string
      ui7: string
      ui8: string
      link: string
      activeLink: string
      successLabel: string
      errorLabel: string
      primary: Palette
      secondary: Palette
      status: {
        info: string
        attention: string
        success: string
        warning: string
        error: string
      }
      neutrals: Palette
    }
    titles: {
      h1: {
        big: {
          fontSize: string
          fontWeight: number
        }
        medium: {
          fontSize: string
          fontWeight: number
        }
        normal: {
          fontSize: string
          fontWeight: number
        }
      }
      h2: {
        normal: {
          fontSize: string
          fontWeight: number
        }
      }
      h3: {
        normal: {
          fontSize: string
          fontWeight: number
        }
      }
      h4: {
        normal: {
          fontSize: string
          fontWeight: number
        }
      }
    }
    texts: {
      normal: {
        fontSize: string
        fontWeight: number
      }
      normalBold: {
        fontSize: string
        fontWeight: number
      }
      big: {
        fontSize: string
        fontWeight: number
      }
      bigBold: {
        fontSize: string
        fontWeight: number
      }
      medium: {
        fontSize: string
        fontWeight: number
      }
      mediumBold: {
        fontSize: string
        fontWeight: number
      }
      small: {
        fontSize: string
        fontWeight: number
      }
      smallBold: {
        fontSize: string
        fontWeight: number
      }
    }
  }
}
