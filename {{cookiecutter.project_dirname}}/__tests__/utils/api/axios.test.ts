import { axios, withApiOptions } from '@/utils/api/axios'
import MockAdapter from 'axios-mock-adapter'

describe('Axios', () => {
  const token = 'test'
  test('composeHeaders', async () => {
    const mock = new MockAdapter(axios)
    mock
      .onGet('/api')
      .reply(200, { response: true }, { Authorization: `Token ${token}` })
    const test = withApiOptions(({ baseUrl }) => {
      return axios.get(`${baseUrl}/api`)
    })
    const { headers } = await test({ token: 'prova' })
    expect(headers.Authorization).toEqual(`Token ${token}`)
  })
})
