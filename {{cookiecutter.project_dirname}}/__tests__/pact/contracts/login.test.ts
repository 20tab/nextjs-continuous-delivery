import { expect } from '@jest/globals'
import { pactWith } from 'jest-pact'

import pactConfig from '@/__tests__/pact/pact.config'
import { login, token } from '@/__tests__/pact/interactions/login'
import * as API from '@/utils/api'

pactWith(pactConfig, provider => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = provider.mockService.baseUrl
  })

  describe('Login', () => {
    test('[Login] A request with correct credentials', async () => {
      await provider.addInteraction(login.succeeded)
      const response = await API.login(login.succeeded.withRequest.body)

      expect(response.status).toBe(200)
      expect(response.data).toEqual({
        firstName: 'John',
        lastName: 'Cleese',
        username: 'john.cleese',
        token
      })
    })
  })
})
