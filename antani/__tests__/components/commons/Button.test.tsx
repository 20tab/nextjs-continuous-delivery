import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/react'
import React from 'react'

import { Button } from '@/components/commons/Button'
import { renderWithReduxAndTheme } from '@/__tests__/functions'

const solidSetup = () => renderWithReduxAndTheme(<Button ui='primary' />)

test('Solid button renders correctly', () => {
  solidSetup()
  const Button = screen.getByRole('button')
  expect(Button).toBeTruthy()
  expect(Button).toHaveStyle(`background-color: #D7F3FF`)
  expect(Button).toHaveStyle(`color: gray`)
})
