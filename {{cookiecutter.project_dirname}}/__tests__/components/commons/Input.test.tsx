import { screen } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'

import { InputWithErrors } from '@/components/commons/Input'
import { renderWithReduxAndTheme } from '@/__tests__/functions'

describe('Input components', () => {
  describe('<InputWithErrors />', () => {
    const setup = () =>
      renderWithReduxAndTheme(
        <InputWithErrors
          placeholder='some-placeholder'
          errors={['This field may not be blank.']}
        />
      )

    const setupWithNoErrors = () =>
      renderWithReduxAndTheme(
        <InputWithErrors placeholder='some-placeholder' />
      )

    test('should render input', () => {
      setup()
      screen.getByPlaceholderText(/some-placeholder/i)
      expect(screen.getByText('This field may not be blank.')).toBeTruthy()
    })

    test('can type into input', () => {
      setupWithNoErrors()
      const input = screen.getByPlaceholderText(/some-placeholder/i)
      expect(input).toHaveValue('')
      userEvent.type(input, 'Some text')
      expect(input).toHaveValue('Some text')
    })
  })
})
