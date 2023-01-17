import { AppState } from '@/store/'

declare global {
  interface Window {
    __NEXT_DATA__: AppState
  }
}
