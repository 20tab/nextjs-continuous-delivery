import React, { FC } from 'react'
import styled from 'styled-components'

import { Logo } from './Logo'
import { ThemeSwitch } from './ThemeSwitch'

const Navbar: FC = () => {
  return (
    <Nav>
      <StyledLogo />
      <ThemeContainer>
        <ThemeSwitch />
      </ThemeContainer>
    </Nav>
  )
}

const Nav = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const StyledLogo = styled(Logo)`
  width: 150px;
`

const ThemeContainer = styled.div`
  padding-right: 15px;
`

export { Navbar }
