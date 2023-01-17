import { HTTPMethod } from '@pact-foundation/pact/src/common/request'
import { term } from '@pact-foundation/pact/src/dsl/matchers'

import { composePactState, PactInteraction } from '@/__tests__/pact/utils'
import {
  csrfToken,
  userEmail,
  userPassword,
  profile,
  sessionId
} from '@/__tests__/pact/data'

export const auth: PactInteraction = {
  login: {
    succeeded: {
      state: composePactState('A user testuser exists'),
      uponReceiving: '[Auth] A login request with valid credentials',
      withRequest: {
        path: '/api/auth/login/',
        method: HTTPMethod.POST,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          username: userEmail,
          password: userPassword
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': term({
            generate: `sessionid=${sessionId}; expires=Mon, 05 Apr 2021 16:48:02 GMT; HttpOnly; Max-Age=1209600; Path=/; SameSite=Lax`,
            matcher: '.*sessionid=[\\w\\d]+;.+\\sHttpOnly;.*'
          })
        },
        body: profile
      }
    },
    emptyCredentials: {
      state: composePactState('A user testuser exists'),
      uponReceiving: '[Auth] A login request with empty credentials',
      withRequest: {
        path: '/api/auth/login/',
        method: HTTPMethod.POST,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          username: '',
          password: ''
        }
      },
      willRespondWith: {
        status: 400,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          username: ['This field may not be blank.'],
          password: ['This field may not be blank.']
        }
      }
    },
    badCredentials: {
      state: composePactState('A user testuser exists'),
      uponReceiving: '[Auth] A login request with bad credentials',
      withRequest: {
        path: '/api/auth/login/',
        method: HTTPMethod.POST,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          username: 'wrong-email@example.org',
          password: 'wrong-password'
        }
      },
      willRespondWith: {
        status: 400,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          nonFieldErrors: ['Unable to log in with provided credentials.']
        }
      }
    }
  },
  logout: {
    succeeded: {
      state: composePactState('A logged-in user testuser session exists'),
      uponReceiving: '[Auth] A valid logout request',
      withRequest: {
        path: '/api/auth/logout/',
        method: HTTPMethod.POST,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-CSRFToken': csrfToken,
          Cookie: `csrftoken=${csrfToken}; sessionid=${sessionId}`
        }
      },
      willRespondWith: {
        status: 204
      }
    },
    failed: {
      state: composePactState('A logged-in user testuser session exists'),
      uponReceiving: '[Auth] A logout request with no active session',
      withRequest: {
        path: '/api/auth/logout/',
        method: HTTPMethod.POST,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-CSRFToken': csrfToken,
          Cookie: `csrftoken=${csrfToken}`
        }
      },
      willRespondWith: {
        status: 403,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: {
          detail: 'Authentication credentials were not provided.'
        }
      }
    }
  },
  retrieve: {
    succeeded: {
      state: composePactState('A logged-in user testuser session exists'),
      uponReceiving: '[Auth] A current user detail request',
      withRequest: {
        path: '/api/auth/me/',
        method: HTTPMethod.GET,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Cookie: `sessionid=${sessionId}`
        }
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: profile
      }
    },
    unauthorized: {
      state: composePactState('A logged-in user testuser session exists'),
      uponReceiving:
        '[Auth] A current user detail request with no active session',
      withRequest: {
        path: '/api/auth/me/',
        method: HTTPMethod.GET,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      },
      willRespondWith: {
        status: 403,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    }
  }
}
