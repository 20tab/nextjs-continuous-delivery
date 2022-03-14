import { AppStore } from '@/store'

type SSRPermissionsMiddleware = {
  redirect: {
    destination: string
    permanent: boolean
  }
}

const ssrAuthMiddleware = async (
  store: AppStore,
  locale: string
): Promise<SSRPermissionsMiddleware | void> => {
  const loginRedirect = {
    redirect: {
      destination: locale ? `/${locale}/login` : `/login`,
      permanent: false
    }
  }

  const state = store.getState()
  const { user } = state.session

  if (!user) {
    return loginRedirect
  }
}

export default ssrAuthMiddleware
