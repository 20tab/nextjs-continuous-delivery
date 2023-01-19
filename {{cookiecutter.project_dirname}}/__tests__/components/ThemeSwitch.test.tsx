import { expect } from '@jest/globals'
import { screen, fireEvent } from '@testing-library/react'
import React from 'react'

import { renderWithWrappers } from '@/__tests__/functions'
import { ThemeSwitch } from '@/components/ThemeSwitch'

const setup = () => renderWithWrappers(<ThemeSwitch />)

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
