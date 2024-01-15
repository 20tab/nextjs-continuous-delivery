import React from 'react'
import styled from 'styled-components'


import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <Container>
      <H1>Hello World!</H1>
    </Container>
  )
}

const H1 = styled.h1`
  font-size: 40px;
  font-weight: 500;
`

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 80px);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  button {
    margin-top: 30px;
  }
`

export default Home
