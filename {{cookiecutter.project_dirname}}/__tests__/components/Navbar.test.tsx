import { expect } from '@jest/globals'
import React from 'react'

import { Navbar } from '@/components/Navbar'

import { renderWithWrappers } from '@/__tests__/functions'

test('Navbar renders correctly', () => {
  const container = renderWithWrappers(<Navbar />)
  expect(container).toMatchSnapshot()
})
