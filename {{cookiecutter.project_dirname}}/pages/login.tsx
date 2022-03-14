import { parseCookies, setCookie } from 'nookies'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Button } from '@/components/commons/Button'
import { InputWithErrors } from '@/components/commons/Input'
import { login } from '@/utils/api'
import { login as loginAction } from '@/store/userSlice'
import { Logo } from '@/components/Logo'
import { useAppDispatch } from '@/utils/hooks/useAppDispatch'
import { wrapper } from '@/store'

const Login = () => {
  const { push } = useRouter()
  const dispatch = useAppDispatch()
  const [state, setState] = useState({
    loading: false,
    errors: null,
    username: '',
    password: ''
  })

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState(prevState => ({ ...prevState, loading: true, errors: {} }))
    const { username, password } = state

    try {
      const { data, status } = await login(null, { username, password })
      if (status === 200) {
        const cookie = parseCookies()
        if (cookie.sessionid === undefined) {
          setCookie(null, 'sessionid', '3td37glcnr4yksg7jpoj3p1ldlemlp9l', {
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
          })
        }
        dispatch(loginAction(data))
        push('/')
      }
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        errors: error?.response?.data || null
      }))
    }
  }

  return (
    <Container>
      <Box>
        <Logo />
        <Form onSubmit={handleOnSubmit}>
          {state.errors?.nonFieldErrors &&
            state.errors?.nonFieldErrors.map(err => (
              <ErrorsText key={err}>{err}</ErrorsText>
            ))}
          {state.errors?.detail && (
            <ErrorsText>{state.errors?.detail}</ErrorsText>
          )}
          <InputWithErrors
            placeholder='Email'
            value={state.username}
            errors={state.errors?.username}
            type='email'
            onChange={e =>
              setState(prevState => ({
                ...prevState,
                username: e.target.value
              }))
            }
          />
          <InputWithErrors
            placeholder='Password'
            value={state.password}
            errors={state.errors?.password}
            type='password'
            onChange={e =>
              setState(prevState => ({
                ...prevState,
                password: e.target.value
              }))
            }
          />
          <Button type='submit' ui='primary'>
            Sign in
          </Button>
        </Form>
      </Box>
      <Code>email: testuser@example.org</Code>
      <Code>password: P4ssw0rd!</Code>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  max-width: 300px;
  height: 100vh;
  flex: 1;
  @media (max-width: 1100px) {
    padding: 10px 20px;
  }
`

const Box = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  margin-bottom: 50px;
  a {
    margin-bottom: 30px;
  }
`

const Code = styled.code`
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  padding: 5px 10px;
  border-radius: 4px;
`

const Form = styled.form`
  width: 100%;
  button {
    width: 100%;
  }
`

const ErrorsText = styled.p`
  color: ${({ theme }) => theme.colors.status.error};
  margin-bottom: 30px;
`

export const getServerSideProps = wrapper.getServerSideProps(
  store => async () => {
    if (store.getState().session.user !== null) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    return {
      props: {}
    }
  }
)

export default Login
