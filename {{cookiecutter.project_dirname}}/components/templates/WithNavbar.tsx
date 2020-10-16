import React, { FC } from 'react'

import { Navbar } from '../Navbar'

const WithNavbar: FC = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export { WithNavbar }
