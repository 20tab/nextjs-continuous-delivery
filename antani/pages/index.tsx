import React from 'react'
import styled from 'styled-components'

import { H1 } from '@/components/commons/Typography'

import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <Container>
      <H1.Normal>Hello World!</H1.Normal>
    </Container>
  )
}

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
