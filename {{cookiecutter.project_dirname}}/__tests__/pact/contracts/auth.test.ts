import { expect } from '@jest/globals'
import { pactWith } from 'jest-pact'

import { auth } from '@/__tests__/pact/interactions/auth'
import { csrfToken, sessionId } from '@/__tests__/pact/data'
import * as API from '@/utils/api'
import pactConfig from '@/__tests__/pact/pact.config'

pactWith(pactConfig, provider => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PROJECT_URL = provider.mockService.baseUrl
  })

  describe('Auth', () => {
    afterEach(() => {
      provider.removeInteractions()
    })

    test(auth.login.succeeded.uponReceiving, async () => {
      await provider.addInteraction(auth.login.succeeded)
      const { data, status } = await API.login(
        null,
        auth.login.succeeded.withRequest.body
      )
      expect(status).toBe(200)
      expect(data).toEqual(auth.login.succeeded.willRespondWith.body)
    })

    test(auth.login.emptyCredentials.uponReceiving, async () => {
      await provider.addInteraction(auth.login.emptyCredentials)
      try {
        await API.login(null, auth.login.emptyCredentials.withRequest.body)
      } catch ({ response }) {
        const { data, status } = response
        expect(status).toBe(400)
        expect(data).toEqual(auth.login.emptyCredentials.willRespondWith.body)
      }
    })

    test(auth.login.badCredentials.uponReceiving, async () => {
      await provider.addInteraction(auth.login.badCredentials)
      try {
        await API.login(null, auth.login.badCredentials.withRequest.body)
      } catch ({ response }) {
        const { data, status } = response
        expect(status).toBe(400)
        expect(data).toEqual(auth.login.badCredentials.willRespondWith.body)
      }
    })

    test(auth.logout.succeeded.uponReceiving, async () => {
      await provider.addInteraction(auth.logout.succeeded)
      const { status } = await API.logout({
        sessionId,
        csrfToken,
        csrfCookie: true
      })
      expect(status).toBe(204)
    })

    test(auth.logout.failed.uponReceiving, async () => {
      await provider.addInteraction(auth.logout.failed)
      try {
        await API.logout({
          csrfToken,
          csrfCookie: true
        })
      } catch ({ response }) {
        const { data, status } = response
        expect(status).toBe(403)
        expect(data).toEqual(auth.logout.failed.willRespondWith.body)
      }
    })

    test(auth.retrieve.succeeded.uponReceiving, async () => {
      await provider.addInteraction(auth.retrieve.succeeded)
      const { data, status } = await API.getLoggedUser({
        sessionId: sessionId
      })
      expect(status).toBe(200)
      expect(data).toEqual(auth.retrieve.succeeded.willRespondWith.body)
    })

    test(auth.retrieve.unauthorized.uponReceiving, async () => {
      await provider.addInteraction(auth.retrieve.unauthorized)
      try {
        await API.getLoggedUser({})
      } catch ({ response }) {
        const { status } = response
        expect(status).toBe(403)
      }
    })
  })
})
