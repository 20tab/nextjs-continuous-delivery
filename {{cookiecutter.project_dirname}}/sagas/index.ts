import { NextPageContext } from 'next'
import { all, call, takeLatest } from 'redux-saga/effects'

import serverSaga from './serverSaga'
import themeSaga from './themeSaga'
import { CHANGE_THEME } from '../store/actions/theme/types'

const rootSaga = function * (ctx: NextPageContext) {
  const isServer = !!(ctx?.req)

  if (isServer) {
    yield call(serverSaga, ctx)
  }

  yield all([
    takeLatest(CHANGE_THEME, themeSaga)
  ])
}

export default rootSaga
