import React from 'react'
import styled from 'styled-components'

import { ThemeSwitch } from '@/components/ThemeSwitch'
import Image from 'next/image'
import { useAppSelector } from '@/store'

const Navbar = () => {
  const theme = useAppSelector(state => state.utils.theme)

  return (
    <Nav>
      <Image
        src={`/images/logo-${theme}.svg`}
        width='110'
        height='48'
        alt={'sito logo'}
      />
      <ThemeSwitch />
    </Nav>
  )
}

const Nav = styled.nav`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.neutrals[100]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
`

export { Navbar }
