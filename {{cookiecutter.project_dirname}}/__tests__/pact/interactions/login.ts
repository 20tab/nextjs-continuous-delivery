import { HTTPMethod } from '@pact-foundation/pact/src/common/request'
import { like } from '@pact-foundation/pact/src/dsl/matchers'

import { composePactState, token } from '@/__tests__/pact/data'

export const login = {
  succeeded: {
    state: composePactState('A user exists'),
    uponReceiving: '[Login] A request with correct credentials',
    withRequest: {
      path: '/api/auth/login/',
      method: HTTPMethod.POST,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        username: 'john.cleese',
        password: 'SPAM!'
      }
    },
    willRespondWith: {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        firstName: 'John',
        lastName: 'Cleese',
        username: 'john.cleese',
        token: like(token)
      }
    }
  }
}
