import { InteractionObject } from '@pact-foundation/pact/src/dsl/interaction'

export const likeToContent = pactBody => {
  if (typeof pactBody === 'object' && !Array.isArray(pactBody)) {
    for (const key in pactBody) {
      if (
        Boolean(pactBody[key]) &&
        Object.prototype.hasOwnProperty.call(pactBody[key], 'contents') &&
        Object.prototype.hasOwnProperty.call(pactBody[key], 'getValue')
      ) {
        pactBody[key] = pactBody[key].contents
      } else likeToContent(pactBody[key])
    }
  } else if (Array.isArray(pactBody)) {
    return pactBody.map(el => likeToContent(el))
  }

  return pactBody
}

export const composePactState = (...args: PactState): string => {
  return args.join(' / ')
}

export type PactInteraction = {
  [description: string]: {
    [status: string]: InteractionObject
  }
}

type PactState = 'A user exists'[]
