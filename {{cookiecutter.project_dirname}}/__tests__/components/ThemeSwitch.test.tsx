import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { ThemeSwitch } from '@/components/ThemeSwitch'
import { renderWithRedux } from '@/__tests__/functions'

const setup = () => renderWithRedux(<ThemeSwitch />)

test('ThemeSwitch renders correctly', () => {
  setup()
  expect(screen.getByRole('checkbox')).toBeTruthy()
})

test('ThemeSwitch toggle dark mode on click', () => {
  setup()
  const input = screen.getByRole('checkbox') as HTMLInputElement

  fireEvent.click(input)
  expect(input.checked).toEqual(true)

  fireEvent.click(input)
  expect(input.checked).toEqual(false)
})
