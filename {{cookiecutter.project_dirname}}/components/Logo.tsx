import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { iState } from '../models/State'
import { iTheme } from '../models/Theme'

export const lightModeLogoPath = '/images/logo.png'
export const darkModeLogoPath = '/images/logo_negative.png'

const Logo: FC = (props) => {
  const theme = useSelector<iState, iTheme>(state => state.theme)
  const isLight = theme === iTheme.light
  const imageSrc = isLight ? lightModeLogoPath : darkModeLogoPath

  return (
    <Link
      href='https://www.20tab.com'
      target='_blank'
      data-testid='logo'
      {...props}
    >
      <Image src={imageSrc} />
    </Link>
  )
}

const Link = styled.a`
  display: block;
`

const Image = styled.img`
  width: 100%;
`

export { Logo }
