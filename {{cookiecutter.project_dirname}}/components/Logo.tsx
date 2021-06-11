import React from 'react'
import styled from 'styled-components'

import { Theme } from '@/models/Utils'
import { useAppSelector } from '@/utils/hooks/useAppSelector'

export const lightModeLogoPath = '/images/logo.png'
export const darkModeLogoPath = '/images/logo_negative.png'

const Logo = props => {
  const theme = useAppSelector(state => state.utils.theme)
  const isLight = theme === Theme.light
  const imageSrc = isLight ? lightModeLogoPath : darkModeLogoPath

  return (
    <Link href='https://www.20tab.com' target='_blank' {...props}>
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
