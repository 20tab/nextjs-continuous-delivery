import { NextPageContext } from 'next'
import { all, call, takeLatest } from 'redux-saga/effects'

import serverSaga from './serverSaga'
import themeSaga from './themeSaga'
import { changeTheme } from '../store/actions/theme'

const rootSaga = function * (ctx: NextPageContext) {
  const isServer = !!(ctx?.req)

  if (isServer) {
    yield call(serverSaga, ctx)
  }

  yield all([
    takeLatest(changeTheme.type, themeSaga)
  ])
}

export default rootSaga
