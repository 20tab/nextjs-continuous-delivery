import { expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import React from 'react'

import { Button } from '@/components/commons/Button'

import { renderWithWrappers } from '@/__tests__/functions'

const solidSetup = () => renderWithWrappers(<Button />)

test('Solid button renders correctly', () => {
  solidSetup()
  const button = window.getComputedStyle(screen.getByRole('button'))
  expect(button.backgroundColor).toBe('rgb(0, 122, 255)')
  expect(button.color).toBe('rgb(241, 249, 255)')
})
