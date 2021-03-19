import React from 'react'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { Logo, lightModeLogoPath, darkModeLogoPath } from '@/components/Logo'
import { renderWithRedux } from '@/__tests__/functions'
import { changeTheme } from '@/store/themeSlice'
import { Theme } from '@/models/Theme'

const setup = () => renderWithRedux(<Logo />)

test('Logo renders correctly', () => {
  setup()
  const logo = screen.getByTestId('logo')
  expect(logo).toBeTruthy()
})

test('Logo is updated on dark mode toggle', () => {
  const store = setup()
  const logo = screen.getByTestId('logo')
  const image = logo.getElementsByTagName('img')[0]

  expect(image).toBeTruthy()
  expect(image.getAttribute('src')).toEqual(lightModeLogoPath)
  store.dispatch(changeTheme(Theme.dark))
  expect(image.getAttribute('src')).toEqual(darkModeLogoPath)
})