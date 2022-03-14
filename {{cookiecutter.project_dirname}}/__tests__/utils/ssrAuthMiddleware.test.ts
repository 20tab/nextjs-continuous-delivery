import ssrAuthMiddleware from '@/utils/ssrAuthMiddleware'
import { store } from '@/__tests__/functions'

describe('SSR AuthMiddleware', () => {
  beforeAll(() => {
    jest.mock('@/__tests__/functions')
    const mockState = {
      session: { user: null }
    }
    store.getState = jest.fn().mockReturnValue(mockState)
  })

  test('Anonymous try access to protected page', async () => {
    const response = await ssrAuthMiddleware(store, 'en')
    expect(response).toMatchObject({
      redirect: { destination: '/en/login', permanent: false }
    })
  })

  test('Anonymous try access to protected page without locale', async () => {
    const response = await ssrAuthMiddleware(store, undefined)
    expect(response).toMatchObject({
      redirect: { destination: '/login', permanent: false }
    })
  })

  afterAll(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
})
