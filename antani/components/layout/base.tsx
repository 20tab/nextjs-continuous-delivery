import React from 'react'

import { Navbar } from '@/components/Navbar'

type Props = {
  children: React.ReactNode
}
const Layout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default Layout
