import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import React from 'react'

import { Outlet } from "react-router-dom"

export const DefaultLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <Outlet />   {/* 👈 THIS IS THE KEY */}
      </main>

      <Footer />
    </div>
  )
}

