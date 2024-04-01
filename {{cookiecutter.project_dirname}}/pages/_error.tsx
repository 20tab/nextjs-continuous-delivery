import * as Sentry from '@sentry/nextjs'
import Error from 'next/error'
import React from 'react'

import type { NextPageContext } from 'next'

const CustomErrorComponent = ({ statusCode }: { statusCode: number }) => {
  return <Error statusCode={statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData)
  return Error.getInitialProps(contextData)
}

export default CustomErrorComponent
