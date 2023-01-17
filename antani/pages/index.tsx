import { NextPage } from 'next'
import React from 'react'
import styled from 'styled-components'

import { MainTitle } from '@/components/commons/Typography'
import { WithNavbar } from '@/components/templates/WithNavbar'
import { wrapper } from '@/store'

const Home: NextPage = () => {
  return (
    <WithNavbar>
      <Container>
        <MainTitle>Hello World!</MainTitle>
      </Container>
    </WithNavbar>
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

export const getServerSideProps = wrapper.getServerSideProps(() => async () => {
  return {
    props: {}
  }
})

export default Home
