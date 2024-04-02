import { expect } from '@jest/globals'
import React from 'react'

import Layout from '@/components/layout/Base'

import { renderWithWrappers } from '@/__tests__/functions'

test('Navbar renders correctly', () => {
  const container = renderWithWrappers(
    <Layout>
      <p>Test base layout</p>
    </Layout>
  )
  expect(container).toMatchSnapshot()
})
