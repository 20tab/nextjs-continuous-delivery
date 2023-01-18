import React from 'react'
import styled from 'styled-components'

import { ThemeSwitch } from '@/components/ThemeSwitch'
import Image from 'next/image'

const Navbar = () => {
  return (
    <Nav>
      <Image
        src={'/images/logo.svg'}
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
`

export { Navbar }
