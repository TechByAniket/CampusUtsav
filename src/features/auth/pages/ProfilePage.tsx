import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import StudentProfilePage from '../components/StudentProfilePage';
import CollegeProfilePage from '../components/CollegeProfilePage';
import StaffProfilePage from '../components/StaffProfilePage';
import ClubProfilePage from '../components/ClubProfilePage';

const ProfilePage = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  // Define which roles use the staff component
  const staffRoles = ['ROLE_FACULTY', 'ROLE_STAFF', 'ROLE_HOD'];

  if (role === 'ROLE_STUDENT') {
    return <StudentProfilePage />;
  }

  if (role === 'ROLE_COLLEGE' || role === 'ROLE_PRINCIPAL') {
    return <CollegeProfilePage />;
  }

  if (staffRoles.includes(role || '')) {
    return <StaffProfilePage />;
  }

  if (role === 'ROLE_CLUB') {
    return <ClubProfilePage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Profile not configured for role: {role}</p>
        <p className="text-slate-300 text-[10px] uppercase tracking-tight">Please contact support if this is an error</p>
      </div>
    </div>
  );
};

export default ProfilePage;
;