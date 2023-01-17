import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/react'
import React from 'react'

import { Button } from '@/components/commons/Button'
import { renderWithReduxAndTheme } from '@/__tests__/functions'
import theme from '@/styles/themes/'

const solidSetup = () => renderWithReduxAndTheme(<Button ui='primary' />)

test('Solid button renders correctly', () => {
  solidSetup()
  const Button = screen.getByRole('button')
  expect(Button).toBeTruthy()
  expect(Button).toHaveStyle(`background-color: ${theme.light.colors.primary}`)
  expect(Button).toHaveStyle(`color: ${theme.light.colors.header}`)
})
