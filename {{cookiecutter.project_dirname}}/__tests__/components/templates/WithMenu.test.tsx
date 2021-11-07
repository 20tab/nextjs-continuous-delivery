import 'next/router'
import { screen } from '@testing-library/react'
import React from 'react'

import { renderWithReduxAndTheme } from '@/__tests__/functions'
import { WithNavbar } from '@/components/templates/WithNavbar'

describe('<WithMenu />', () => {
  const setup = () =>
    renderWithReduxAndTheme(
      <WithNavbar>
        <p>A child</p>
      </WithNavbar>
    )
  test('render its children', () => {
    setup()
    screen.getByText(/A child/)
  })
})
