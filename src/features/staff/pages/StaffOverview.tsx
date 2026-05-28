import { PrincipalOverview } from '@/features/college/pages/college-dashboard/PrincipalOverview'
import React from 'react'

export const StaffOverview = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <main className="max-w-7xl mx-auto space-y-16 relative z-10 px-4 sm:px-6 lg:px-8">
        <PrincipalOverview />
      </main>
    </div>
  )
}
