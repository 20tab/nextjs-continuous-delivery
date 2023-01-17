import { setCookie } from 'nookies'
import MockAdapter from 'axios-mock-adapter'

import { axios, withApiOptions } from '@/utils/api/axios'

describe('Axios', () => {
  const csrfToken =
    'd6mvMfm4sHenfSlA1A0Vpq6k3H5LLcDoxNHZg6h6YoEPTraxMreTYjsRyBNlyi7Y'
  const sessionId = 'b3c049444ef345e1fe02e6d2283c3086bcadbf6f'
  const cookie = `csrftoken=${csrfToken}; sessionid=${sessionId}`
  test('composeHeaders on get', async () => {
    const mock = new MockAdapter(axios)
    mock
      .onGet('/api')
      .reply(200, { response: true }, { cookie: `sessionid=${sessionId}` })
    const test = withApiOptions(({ baseUrl }) => {
      return axios.get(`${baseUrl}/api`)
    })
    const { headers } = await test({ sessionId })
    expect(headers.cookie).toEqual(`sessionid=${sessionId}`)
  })
  test('composeHeaders on post', async () => {
    const mock = new MockAdapter(axios)
    setCookie(null, 'csrftoken', csrfToken, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    })
    mock
      .onPost('/api')
      .reply(200, { response: true }, { cookie, 'X-CSRFToken': csrfToken })
    const test = withApiOptions(({ baseUrl }) => {
      return axios.post(`${baseUrl}/api`)
    })
    const { headers } = await test({ sessionId, csrfToken })
    expect(headers.cookie).toEqual(cookie)
    expect(headers['X-CSRFToken']).toEqual(csrfToken)
  })
})
