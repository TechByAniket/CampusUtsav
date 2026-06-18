import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getAllClubsForPrincipal } from "@/services/clubService";
import { fetchStaffMembers } from "@/services/staffService";
import { getAllPendingApprovalsByRole, getRevertedEventsByClub } from "@/services/eventService";

export const useDashboardCounts = () => {
    const { role } = useSelector((state: RootState) => state.auth);

    const isCollegeAdmin = role === 'ROLE_COLLEGE' || role === 'ROLE_PRINCIPAL';
    const isClubAdmin = role === 'ROLE_CLUB';
    const isStaffAdmin = role === 'ROLE_FACULTY' || role === 'ROLE_HOD' || role === 'ROLE_STAFF';

    // 1. Pending Clubs (College Dashboard)
    const { data: clubsRaw = [], isLoading: isLoadingClubs } = useQuery({
        queryKey: ['sidebar-clubs-count'],
        queryFn: getAllClubsForPrincipal,
        enabled: isCollegeAdmin,
        staleTime: 60000, 
    });

    // 2. Pending Staff (College Dashboard)
    const { data: staffRaw = [], isLoading: isLoadingStaff } = useQuery({
        queryKey: ['sidebar-staff-count'],
        queryFn: fetchStaffMembers,
        enabled: isCollegeAdmin,
        staleTime: 60000,
    });

    // 3. Inbox (College / Staff) - Pending Approvals
    const { data: pendingApprovalsRaw = [], isLoading: isLoadingApprovals } = useQuery({
        queryKey: ['sidebar-inbox-approvals-count'],
        queryFn: getAllPendingApprovalsByRole,
        enabled: isCollegeAdmin || isStaffAdmin,
        staleTime: 60000,
    });

    // 4. Inbox (Club) - Reverted Events
    const { data: revertedEventsRaw = [], isLoading: isLoadingReverts } = useQuery({
        queryKey: ['sidebar-inbox-reverts-count'],
        queryFn: getRevertedEventsByClub,
        enabled: isClubAdmin,
        staleTime: 60000,
    });

    const clubs = Array.isArray(clubsRaw) ? clubsRaw : [];
    const staff = Array.isArray(staffRaw) ? staffRaw : [];
    const pendingApprovals = Array.isArray(pendingApprovalsRaw) ? pendingApprovalsRaw : [];
    const revertedEvents = Array.isArray(revertedEventsRaw) ? revertedEventsRaw : [];

    const pendingClubsCount = clubs.filter((c: any) => c.status === 'PENDING').length;
    const pendingStaffCount = staff.filter((s: any) => s.status === 'PENDING').length;
    const inboxCount = isClubAdmin ? revertedEvents.length : pendingApprovals.length;

    const isLoading = 
        (isCollegeAdmin && (isLoadingClubs || isLoadingStaff)) || 
        ((isCollegeAdmin || isStaffAdmin) && isLoadingApprovals) || 
        (isClubAdmin && isLoadingReverts);

    return {
        pendingClubsCount,
        pendingStaffCount,
        inboxCount,
        isLoading
    };
};
