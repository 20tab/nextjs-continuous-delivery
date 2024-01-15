import { expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import React from 'react'

import { Button } from '@/src/components/commons/Button'
import { renderWithWrappers } from '@/__tests__/functions'

const solidSetup = () => renderWithWrappers(<Button />)

test('Solid button renders correctly', () => {
  solidSetup()
  const button = window.getComputedStyle(screen.getByRole('button'))
  expect(button.backgroundColor).toBe('rgb(49, 108, 244)')
  expect(button.color).toBe('rgb(241, 249, 255)')
})
