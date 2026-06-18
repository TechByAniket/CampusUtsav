import { StudentsInfoList } from '@/features/college/components/StudentsInfoList'
import { students } from '@/services/studentService'
import React from 'react'

export const StaffMembersTab = () => {
  return (
    <div><StudentsInfoList students={students} /></div>
  )
}
