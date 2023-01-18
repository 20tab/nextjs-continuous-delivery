import type { DefaultTheme } from 'styled-components'

const theme: DefaultTheme = {
  colors: {
    ui1: '#F1F9FF',
    ui2: '#EDF8FF',
    ui3: '#E0EAEF',
    ui4: '#E5E8EB',
    ui5: '#A6B0BB',
    ui6: '#696D73',
    ui7: '#333333',
    ui8: '#1C1C1C',
    link: '#316CF4',
    activeLink: '#007AFF',
    successLabel: '#B0FFD9',
    errorLabel: '#FFD0D0',
    primary: {
      0: '#D7F3FF',
      100: '#94D5F2',
      200: '#4D96DC',
      300: '#098BC5',
      400: '#00529E',
      500: '#002E5C'
    },
    secondary: {
      0: '#34A853',
      100: '#FBBA03'
    },
    status: {
      info: '#007AFF',
      attention: '#FFC700',
      success: '#1AC755',
      warning: '#FF7A00',
      error: '#BA1B23'
    },
    neutrals: {
      0: '#FFFFFF',
      100: '#F4F7F8',
      200: '#D2D7DA',
      300: '#B3B9BD',
      400: '#949CA1',
      500: '#777F86',
      600: '#404952'
    }
  },
  titles: {
    h1: {
      normal: {
        fontSize: '40px',
        fontWeight: 500
      },
      big: {
        fontSize: '50px',
        fontWeight: 500
      },
      medium: {
        fontSize: '45px',
        fontWeight: 500
      }
    },
    h2: {
      normal: {
        fontSize: '32px',
        fontWeight: 500
      }
    },
    h3: {
      normal: {
        fontSize: '24px',
        fontWeight: 500
      }
    },
    h4: {
      normal: {
        fontSize: '20px',
        fontWeight: 500
      }
    }
  },
  texts: {
    normal: {
      fontSize: '16px',
      fontWeight: 400
    },
    normalBold: {
      fontSize: '16px',
      fontWeight: 700
    },
    big: {
      fontSize: '18px',
      fontWeight: 400
    },
    bigBold: {
      fontSize: '18px',
      fontWeight: 700
    },
    medium: {
      fontSize: '12px',
      fontWeight: 400
    },
    mediumBold: {
      fontSize: '12px',
      fontWeight: 700
    },
    small: {
      fontSize: '10px',
      fontWeight: 400
    },
    smallBold: {
      fontSize: '10px',
      fontWeight: 500
    }
  }
}

export { theme }
