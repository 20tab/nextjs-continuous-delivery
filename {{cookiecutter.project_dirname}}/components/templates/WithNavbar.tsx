import React from 'react'

import { Navbar } from '@/components/Navbar'

type Props = {
  children: React.ReactNode
}

const WithNavbar = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export { WithNavbar }
