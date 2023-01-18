import { expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import React from 'react'

import { Button } from '@/components/commons/Button'
import { renderWithWrappers } from '@/__tests__/functions'

const solidSetup = () => renderWithWrappers(<Button ui='primary' />)

test('Solid button renders correctly', () => {
  solidSetup()
  const button = window.getComputedStyle(screen.getByRole('button'))
  expect(button.backgroundColor).toBe('rgb(215, 243, 255)')
  expect(button.color).toBe('gray')
})
