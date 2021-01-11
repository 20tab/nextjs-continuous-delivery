import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { iState } from '../models/State'
import { iTheme } from '../models/Theme'

const Logo: FC = (props) => {
  const theme = useSelector<iState, iTheme>(state => state.theme)
  const isLight = theme === iTheme.light
  const imageSrc = isLight ? '/images/logo.png' : '/images/logo_negative.png'

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
