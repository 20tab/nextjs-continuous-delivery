import { expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import React from 'react'

import { Navbar } from '@/components/Navbar'
import { renderWithWrappers } from '@/__tests__/functions'

const setup = () => renderWithWrappers(<Navbar />)

test('Navbar renders correctly', () => {
  setup()
  expect(screen.getByRole('img')).toBeTruthy()
})
