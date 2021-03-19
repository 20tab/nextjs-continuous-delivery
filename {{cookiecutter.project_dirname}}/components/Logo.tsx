import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { State } from '@/models/State'
import { Theme } from '@/models/Theme'

export const lightModeLogoPath = '/images/logo.png'
export const darkModeLogoPath = '/images/logo_negative.png'

const Logo = props => {
  const theme = useSelector<State, Theme>(state => state.theme.theme)
  const isLight = theme === Theme.light
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
