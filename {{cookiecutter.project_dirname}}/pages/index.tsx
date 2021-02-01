import React, { FC } from 'react'
import styled from 'styled-components'

import { WithNavbar } from '../components/templates/WithNavbar'

const Home: FC = () => {
  return (
    <WithNavbar>
      <Container>
        <Title data-testid='welcome_message'>Hello world!</Title>
        <Text>Start editing <Code>pages/index.tsx</Code></Text>
      </Container>
    </WithNavbar>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled.h1`
  font-size: 80px;
  margin-bottom: 0px;

  @media (min-width: 768px) {
    font-size: 120px;
  }
`

const Text = styled.p`
  font-size: 28px;
`

const Code = styled.code`
  background: ${props => props.theme.text};
  color: ${props => props.theme.background};
  padding: 5px 10px;
  border-radius: 4px;
`

export default Home
