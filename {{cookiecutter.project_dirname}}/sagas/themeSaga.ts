import nookies from 'nookies'

import { ChangeTheme } from '../store/actions/theme/types'

// TODO: fix me
// eslint-disable-next-line require-yield
const themeSaga = function * (action: ChangeTheme) {
  nookies.set(null, 'theme', action.payload, {
    path: '/'
  })
}

export default themeSaga
