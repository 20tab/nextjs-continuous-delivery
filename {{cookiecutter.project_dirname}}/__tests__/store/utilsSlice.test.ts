import reducer, { getEnvs, changeTheme } from '@/store/utilsSlice'

describe('Utils Slice', () => {
  describe('reducers', () => {
    test('Get envs', () => {
      expect(
        reducer(
          undefined,
          getEnvs({ NEXT_PUBLIC_API_URL: 'https://localhost:8443' })
        )
      ).toEqual({
        envs: { NEXT_PUBLIC_API_URL: 'https://localhost:8443' },
        theme: 'light'
      })
    })
    test('Change theme', () => {
      expect(reducer(undefined, changeTheme('dark'))).toEqual({
        envs: {},
        theme: 'dark'
      })
    })
  })
})
