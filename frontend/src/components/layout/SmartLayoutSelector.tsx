import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { CollegeDashboardLayout } from "@/layouts/CollegeDashboardLayout";
import { ClubDashboardLayout } from "@/layouts/ClubDashboardLayout";
import { StaffDashboardLayout } from "@/layouts/StaffDashboardLayout";
import { DefaultLayout } from "@/layouts/DefaultLayout";

export const SmartLayoutSelector = () => {
  const { role } = useSelector((state: RootState) => state.auth);

  if (role === 'ROLE_COLLEGE' || role === 'ROLE_PRINCIPAL') {
    return <CollegeDashboardLayout />;
  }
  if (role === 'ROLE_CLUB') {
    return <ClubDashboardLayout />;
  }
  if (role === 'ROLE_FACULTY' || role === 'ROLE_HOD') {
    return <StaffDashboardLayout />;
  }
  
  // For ROLE_STUDENT or unauthorized (guest), render DefaultLayout
  return <DefaultLayout />;
};
