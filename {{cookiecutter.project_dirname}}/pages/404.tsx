import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

import { Button } from '@/components/commons/Button'
import { H1 } from '@/components/commons/Typography'

export default function Custom404() {
  return (
    <Container>
      <H1.Normal>404 - Page Not Found</H1.Normal>
      <Link href='/'>
        <Button>Back to Home</Button>
      </Link>
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
  a {
    text-decoration: none;
  }
  button {
    margin-top: 30px;
  }
`
