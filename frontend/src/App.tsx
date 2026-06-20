
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './features/home/pages/HomePage'
import { CollegeDashboardLayout } from './layouts/CollegeDashboardLayout'
import { Overview } from './features/college/pages/college-dashboard/Overview'
import { Events } from './features/college/pages/college-dashboard/Events'
import { Students } from './features/college/pages/college-dashboard/Students'
import { AuthLayout } from './layouts/AuthLayout'
import { SignIn } from './features/auth/pages/SignIn'
import { SignUp } from './features/auth/pages/SignUp'
import { AdminEventDetailsPage } from './features/events/pages/AdminEventDetailsPage'
import { Clubs } from './features/college/pages/college-dashboard/Clubs'
import { ClubDetailsPage } from './features/clubs/pages/ClubDetailsPage'
import { Inbox } from './features/college/pages/college-dashboard/Inbox'
import { Toaster } from 'sonner'
// import { Club, Scroll } from 'lucide-react'
import { ClubDashboardLayout } from './layouts/ClubDashboardLayout'
import { ClubOverview } from './features/clubs/pages/club-dashboard/ClubOverview'
import { ClubEvents } from './features/clubs/pages/club-dashboard/ClubEvents'
import { ClubInbox } from './features/clubs/pages/club-dashboard/ClubInbox'
import { ExploreEventsPage } from './features/home/pages/ExploreEventsPage'
import ScrollToTop from './components/ui/ScrollToTop'
import { DefaultLayout } from './layouts/DefaultLayout'
import { PublicEventDetailsPage } from './features/events/pages/PublicEventDetailsPage'
import { AboutPage } from './features/home/pages/AboutPage'
import { AttendancePage } from './features/attendance/pages/AttendancePage'
import { EventRegistrationsPage } from './features/events/pages/EventRegistrationsPage'
import { TermsAndConditionsPage } from './features/home/pages/TermsAndConditionsPage'
import { PrivacyPolicyPage } from './features/home/pages/PrivacyPolicyPage'
import { Staff } from './features/college/pages/college-dashboard/Staff'
import { StaffOverview } from './features/staff/pages/StaffOverview'
import { StaffInbox } from './features/staff/pages/StaffInbox'
import { StaffEvents } from './features/staff/pages/StaffEvents'
import { StaffDashboardLayout } from './layouts/StaffDashboardLayout'
import { StaffClub } from './features/staff/pages/StaffClub'
import { StaffMembersTab } from './features/staff/pages/StaffMembersTab'
import ProtectedRoute from './components/auth/ProtectedRoute'
import NotFound from './components/error_pages/NotFound'
import AccessDenied from './components/error_pages/AccessDenied'
import ProfilePage from './features/auth/pages/ProfilePage'
import MyRegistrationsPage from './features/student/pages/MyRegistrationsPage'
// import { De } from 'zod/v4/locales'
import { DashboardLayoutSelector } from './components/layout/DashboardLayoutSelector'
import { SmartLayoutSelector } from './components/layout/SmartLayoutSelector'
import { NotificationsPage } from './features/notifications/pages/NotificationsPage'



function App() {

  return (
  <>
    <Toaster richColors position="top-right" />
    <ScrollToTop />

    <Routes>

      {/* ================= PUBLIC SITE ================= */}
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        {/* Legal */}
        <Route path="terms" element={<TermsAndConditionsPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        {/* Public 404 / Access Denied */}
        <Route path="access-denied" element={<AccessDenied />} />
        {/* The asterisk '*' matches anything not defined above */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================= SMART ROUTING FOR SHARED PUBLIC PAGES ================= */}
      <Route element={<SmartLayoutSelector />}>
        <Route path="explore-events" element={<ExploreEventsPage />} />
        <Route path="explore-events/events/:id" element={<PublicEventDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      {/* ================= COLLEGE DASHBOARD ================= */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_COLLEGE', 'ROLE_PRINCIPAL']} />}>
        <Route path="college-dashboard" element={<CollegeDashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="events" element={<Events />} />
          <Route path="staff" element={<Staff/>} />
          <Route path="events/:id" element={<AdminEventDetailsPage />} />
          <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
          <Route path="events/:id/attendance" element={<AttendancePage />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/:clubId" element={<ClubDetailsPage />} />
          <Route path="students" element={<Students />} />
        </Route>
      </Route>

      {/* ================= CLUB DASHBOARD ================= */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_CLUB']} />}>
        <Route path="club-dashboard" element={<ClubDashboardLayout />}>
          <Route index element={<ClubOverview />} />
          <Route path="overview" element={<ClubOverview />} />
          <Route path="events" element={<ClubEvents />} />
          <Route path="events/:id" element={<AdminEventDetailsPage />} />
          <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
          <Route path="events/:id/attendance" element={<AttendancePage />} />
          <Route path="inbox" element={<ClubInbox />} />
        </Route>
      </Route>

      {/* ================= STAFF DASHBOARD ================= */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_HOD']} />}>
        <Route path="staff-dashboard" element={<StaffDashboardLayout />}>
          <Route index element={<StaffOverview />} />
          <Route path="overview" element={<StaffOverview />} />
          <Route path="inbox" element={<StaffInbox />} />
          <Route path="events" element={<StaffEvents />} />
          <Route path="events/:id" element={<AdminEventDetailsPage />} />
          <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
          <Route path="events/:id/attendance" element={<AttendancePage />} />
          <Route path="members" element={<StaffMembersTab />} />
          <Route path="club" element={<StaffClub />} />
        </Route>
      </Route>

      {/* ================= SHARED PROTECTED PAGES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_COLLEGE', 'ROLE_PRINCIPAL', 'ROLE_CLUB', 'ROLE_FACULTY', 'ROLE_HOD', 'ROLE_STUDENT']} />}>
        <Route element={<DashboardLayoutSelector />}>
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="users/profile" element={<ProfilePage />} />
          <Route path="user/settings" element={<ProfilePage />} />
          <Route path="users/registrations" element={<MyRegistrationsPage />} />
        </Route>
      </Route>

      {/* ================= AUTH ================= */}
      <Route path="auth" element={<AuthLayout />}>
        <Route index element={<SignIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>

    </Routes>
  </>
)

}

export default App