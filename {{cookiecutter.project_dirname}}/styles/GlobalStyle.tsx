import { createGlobalStyle } from 'styled-components'
import { normalize } from 'styled-normalize'

import {
  Open_Sans as OpenSans,
  Hepta_Slab as HeptaSlab
} from '@next/font/google'

const baseFont = OpenSans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic']
})

const titleFont = HeptaSlab({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal']
})

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
  }

  body {
    font-family: ${baseFont.style.fontFamily};
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.neutrals[0]};
    color: ${({ theme }) => theme.colors.ui8};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${titleFont.style.fontFamily};
  }
`
