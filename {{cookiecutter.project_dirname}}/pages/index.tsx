import { destroyCookie } from 'nookies'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

import { Button } from '@/components/commons/Button'
import { logout } from '@/utils/api'
import { logout as logoutAction } from '@/store/userSlice'
import { MainTitle } from '@/components/commons/Typography'
import { useAppDispatch } from '@/utils/hooks/useAppDispatch'
import { useAppSelector } from '@/utils/hooks/useAppSelector'
import { WithNavbar } from '@/components/templates/WithNavbar'
import { wrapper } from '@/store'
import ssrAuthMiddleware from '@/utils/ssrAuthMiddleware'

const Home: NextPage = () => {
  const { user } = useAppSelector(state => state.session)
  const { push } = useRouter()

  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    try {
      const { status } = await logout({})
      if (status === 204) {
        dispatch(logoutAction())
        push('/')
        destroyCookie(null, 'sessionid')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <WithNavbar>
      <Container>
        <MainTitle>
          Hello <Code>{user?.email}</Code>!
        </MainTitle>
        <Button ui='primary' onClick={handleLogout}>
          Logout
        </Button>
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

const Code = styled.code`
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  padding: 5px 10px;
  border-radius: 4px;
`

export const getServerSideProps = wrapper.getServerSideProps(
  store =>
    async ({ locale }) => {
      const redirect = await ssrAuthMiddleware(store, locale)
      if (redirect) return redirect
      return {
        props: {}
      }
    }
)

export default Home
