import reducer, { changeTheme, setEnvs } from '@/store/utilsSlice'

describe('Utils Slice', () => {
  describe('reducers', () => {
    test('Change theme', () => {
      expect(reducer(undefined, changeTheme('dark'))).toEqual({
        envs: {},
        theme: 'dark'
      })
    })
    test('Set envs', () => {
      expect(
        reducer(
          undefined,
          setEnvs({ NEXT_PUBLIC_API_URL: 'https://localhost:8443' })
        )
      ).toEqual({
        envs: { NEXT_PUBLIC_API_URL: 'https://localhost:8443' },
        theme: 'light'
      })
    })
  })
})
