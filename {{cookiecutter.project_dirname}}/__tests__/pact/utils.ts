import type { InteractionObject } from '@pact-foundation/pact'

export type PactInteraction = {
  [description: string]: {
    [status: string]: InteractionObject
  }
}
