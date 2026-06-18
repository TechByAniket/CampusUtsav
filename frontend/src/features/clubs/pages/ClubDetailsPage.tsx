import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  getClubDetailsByClubId 
} from "@/services/clubService";
import { getAllEventsByClub } from "@/services/eventService";
import type { EventSummary } from "@/types/event";
import { 
  ArrowLeft,
  Info
} from "lucide-react";
import { toast } from "sonner";

import type { RootState } from "@/store/store";

// Details Components
import { ClubHero } from "../components/details/ClubHero";
import { ClubMission } from "../components/details/ClubMission";
import { ClubEventTimeline } from "../components/details/ClubEventTimeline";
import { ClubLeadership } from "../components/details/ClubLeadership";
import { ClubInstitutionCard } from "../components/details/ClubInstitutionCard";
import { ClubSocialConnect } from "../components/details/ClubSocialConnect";

interface ClubDetail {
  id: number;
  name: string;
  username: string;
  shortForm: string;
  adminName: string;
  facultyCoordinatorName: string | null;
  facultyCoordinatorEmail: string | null;
  adminEmail: string;
  adminPhone: string;
  description: string;
  branchShortForm: string;
  logoUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  linkedInUrl: string;
  createdAt: string;
  updatedAt: string;
  college: {
    id: number;
    name: string;
    shortForm: string;
    city: string;
    district: string;
    state: string;
  };
}

export const ClubDetailsPage = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);
  
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collegeId || !clubId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [clubData, eventsData] = await Promise.all([
          getClubDetailsByClubId(Number(collegeId), Number(clubId)),
          getAllEventsByClub(Number(clubId))
        ]);
        setClub(clubData);
        setEvents(eventsData || []);
      } catch (err) {
        toast.error("Failed to load club intelligence");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collegeId, clubId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest text-center mt-2">Fetching Club Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-center max-w-md border border-slate-100">
           <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Info size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Club Not Found</h2>
           <p className="text-slate-500 text-sm mb-8 leading-relaxed">The club you are looking for might have been removed or the ID is incorrect.</p>
           <Link to="/college-dashboard/clubs" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
              <ArrowLeft size={16} /> Back to Dashboard
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      
      {/* Hero Section */}
      <ClubHero 
        name={club.name}
        shortForm={club.shortForm}
        logoUrl={club.logoUrl}
        collegeName={club.college.name}
        backLink="/college-dashboard/clubs"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <ClubMission 
              description={club.description}
              branch={club.branchShortForm}
              createdAt={club.createdAt}
            />
            
            <ClubEventTimeline events={events} />
          </div>

          {/* Sidebar Content (Right) */}
          <div className="space-y-8">
            <ClubLeadership 
              adminName={club.adminName}
              adminEmail={club.adminEmail}
              adminPhone={club.adminPhone}
              facultyName={club.facultyCoordinatorName}
              facultyEmail={club.facultyCoordinatorEmail}
            />

            <ClubInstitutionCard 
              collegeName={club.college.name}
              city={club.college.city}
              district={club.college.district}
              state={club.college.state}
            />

            <ClubSocialConnect 
              instagramUrl={club.instagramUrl}
              linkedInUrl={club.linkedInUrl}
              websiteUrl={club.websiteUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


