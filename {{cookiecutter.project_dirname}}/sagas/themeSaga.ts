import nookies from 'nookies'

import { changeTheme } from '../store/actions/theme'
import { Action } from '@reduxjs/toolkit'

// TODO: trovare una soluzione migliore per tipizzare il payload delle azioni.
// eslint-disable-next-line require-yield
const themeSaga = function * (action: Action) {
  if (changeTheme.match(action)) {
    nookies.set(null, 'theme', action.payload, {
      path: '/'
    })
  }
}

export default themeSaga
