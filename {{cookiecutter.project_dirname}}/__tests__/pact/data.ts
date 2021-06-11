import { InteractionObject } from '@pact-foundation/pact/src/dsl/interaction'

export const composePactState = (...args: PactState): string => {
  return args.join(' / ')
}

export type PactInteraction = {
  [description: string]: {
    [status: string]: InteractionObject
  }
}

type PactState = 'A user exists'[]

export const token = 'b3c049444ef345e1fe02e6d2283c3086bcadbf6f'
