import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/react'
import React from 'react'

import { Logo } from '@/components/Logo'
import { renderWithReduxAndTheme } from '@/__tests__/functions'

const setup = () => renderWithReduxAndTheme(<Logo />)

test('Logo renders correctly', () => {
  setup()
  const logo = screen.getByRole('link')
  expect(logo).toBeTruthy()
})
