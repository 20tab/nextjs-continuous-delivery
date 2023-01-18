import { expect } from '@jest/globals'
import { screen } from '@testing-library/react'
import React from 'react'

import { Input, InputWithErrors } from '@/components/commons/Input'
import { renderWithWrappers } from '@/__tests__/functions'

describe('Input components', () => {
  describe('<InputWithErrors />', () => {
    const setup = () =>
      renderWithWrappers(
        <InputWithErrors
          placeholder='some-placeholder'
          errors={['This field may not be blank.']}
        />
      )

    const setupWithNoErrors = () =>
      renderWithWrappers(<Input placeholder='some-placeholder' />)

    test('should render input', () => {
      setup()
      screen.getByPlaceholderText(/some-placeholder/i)
      expect(screen.getByText('This field may not be blank.')).toBeTruthy()
    })

    test('should render input without error', () => {
      setupWithNoErrors()
      const input: HTMLInputElement =
        screen.getByPlaceholderText(/some-placeholder/i)
      expect(input.value).toBe('')
    })
  })
})
