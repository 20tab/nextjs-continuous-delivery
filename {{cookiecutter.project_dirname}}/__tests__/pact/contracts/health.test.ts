import { expect } from '@jest/globals'
import { HTTPMethods } from '@pact-foundation/pact/src/common/request'
import { pactWith } from 'jest-pact/dist/v3'

import pactConfig from '@/__tests__/pact/pact.config'

import { axios, withApiOptions } from '@/utils/api/axios'

const healthCheck = withApiOptions<{ status: string }>(({ baseUrl }) => {
  return axios.get(`${baseUrl}/api/health/`)
})

pactWith(pactConfig, interaction => {
  const interactionName = 'A health check request'
  interaction(interactionName, ({ provider, execute }) => {
    beforeEach(() => {
      provider
        .uponReceiving(interactionName)
        .withRequest({
          method: HTTPMethods.GET,
          path: '/api/health/'
        })
        .willRespondWith({
          contentType: 'application/json; charset=utf-8',
          status: 204,
          body: ''
        })
    })
    execute(interactionName, async mockServer => {
      const { status } = await healthCheck({
        baseUrl: mockServer.url
      })
      expect(status).toBe(204)
    })
  })
})
