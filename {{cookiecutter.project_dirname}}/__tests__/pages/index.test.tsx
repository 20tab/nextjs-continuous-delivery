import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Home from '@/pages'
import { renderWithRedux } from '@/__tests__/functions'

test('Homepage render welcome message', () => {
  renderWithRedux(<Home />)
  expect(
    screen.getByRole('heading', { name: /hello world/i })
  ).toHaveTextContent('Hello world')
})
