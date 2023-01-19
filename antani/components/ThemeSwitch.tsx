import React, { useMemo } from 'react'
import styled from 'styled-components'
import nookies from 'nookies'

import { Theme } from '@/models/Utils'
import { changeTheme } from '@/store/utilsSlice'
import { useAppDispatch, useAppSelector } from '@/store'

const ThemeSwitch = () => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.utils.theme)

  const isDark = useMemo(() => theme === Theme.dark, [theme])
  const handlePressTheme = () => {
    const newTheme = isDark ? Theme.light : Theme.dark

    nookies.set(null, 'THEME', newTheme, {
      path: '/'
    })

    dispatch(changeTheme(newTheme))
  }

  return (
    <Switch>
      <Input type='checkbox' onChange={handlePressTheme} checked={isDark} />
      <Slider />
    </Switch>
  )
}

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 45px;
  height: 24px;
`

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  outline: none;

  &:checked + span {
    background-color: black;

    &::before {
      transform: translateX(20px);
    }
  }

  &:focus + span {
    box-shadow: 0 0 1px black;
  }
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.neutrals[0]};
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: ${({ theme }) => theme.colors.ui8};
    border-radius: 50%;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`

export { ThemeSwitch }
