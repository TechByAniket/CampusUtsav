import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export const InboxTabs: React.FC<{
  activeStatus: string;
  setActiveStatus: (status: string) => void;
}> = ({ activeStatus, setActiveStatus }) => {

  return (
    <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
  <TabsList className="flex gap-2 p-1 bg-white/70 backdrop-blur rounded-full shadow-sm border">
    {[
      { label: "Pending", value: "pending" },
      { label: "Needs Change", value: "needs-change" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
    ].map((tab) => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        className={`
          flex-1 rounded-full px-4 py-2 text-sm font-medium
          text-gray-600 transition-all
          data-[state=active]:shadow-md
          ${
            tab.value === "pending"
              ? "data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
              : tab.value === "needs-change"
              ? "data-[state=active]:bg-sky-500 data-[state=active]:text-white"
              : tab.value === "approved"
              ? "data-[state=active]:bg-green-600 data-[state=active]:text-white"
              : "data-[state=active]:bg-red-500 data-[state=active]:text-white"
          }
        `}
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>


  )
}
