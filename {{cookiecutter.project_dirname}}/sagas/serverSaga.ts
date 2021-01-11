import { put } from 'redux-saga/effects'
import { NextPageContext } from 'next'
import nookies from 'nookies'

import { changeTheme } from '../store/actions/theme'
import { iTheme } from '../models/Theme'

const serverSaga = function * (ctx: NextPageContext) {
  const cookies = nookies.get(ctx)

  if (cookies.theme) {
    yield put(changeTheme(
      cookies.theme === iTheme.dark ? iTheme.dark : iTheme.light
    ))
  }
}

export default serverSaga
