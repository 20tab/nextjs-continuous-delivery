import { put } from 'redux-saga/effects'
import { NextPageContext } from 'next'
import nookies from 'nookies'

import { changeTheme } from '../store/actions/theme'
import { Theme } from '../models/Theme'

const serverSaga = function * (ctx: NextPageContext) {
  const cookies = nookies.get(ctx)

  if (cookies.theme) {
    yield put(changeTheme(
      cookies.theme === Theme.dark ? Theme.dark : Theme.light
    ))
  }
}

export default serverSaga
