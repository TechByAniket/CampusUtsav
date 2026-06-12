import React, { useState, useEffect, useMemo } from 'react';
import { Users } from 'lucide-react';
import { getAllClubsForPrincipal, updateClubAccountStatus } from '@/services/clubService';
import { fetchAccountStatuses } from '@/services/staffService';
import { toast } from 'sonner';

// Component Imports
import { ClubsHeader } from '../../components/clubs/ClubsHeader';
import { ClubsStatusTabs } from '../../components/clubs/ClubsStatusTabs';
import { ClubsTable } from '../../components/clubs/ClubsTable';
import { ClubsMobileList } from '../../components/clubs/ClubsMobileList';
import { ClubDetailModal } from '../../components/clubs/ClubDetailModal';

interface Club {
  id: number;
  name: string;
  shortForm: string;
  adminName: string;
  managedBy: string;
  status: string;
  logoUrl: string;
}

export const Clubs = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [clubs, setClubs] = useState<Club[]>([]);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [pendingStatusChanges, setPendingStatusChanges] = useState<Record<number, string>>({});

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const [clubList, statuses] = await Promise.all([
          getAllClubsForPrincipal(),
          fetchAccountStatuses()
        ]);
        setClubs(clubList);
        setAvailableStatuses(statuses);
        
        const pendingCount = clubList.filter((c: Club) => c.status === 'PENDING').length;
        if (pendingCount === 0 && clubList.length > 0) {
           const firstStatus = statuses.find((s: string) => clubList.some((c: Club) => c.status === s)) || statuses[0];
           if (firstStatus) setActiveTab(firstStatus);
        }
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleUpdateStatusDatabase = async (id: number) => {
    const newStatus = pendingStatusChanges[id];
    try {
      await updateClubAccountStatus(id, newStatus);
      setClubs(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      
      if (selectedClub?.id === id) {
          setSelectedClub(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      setPendingStatusChanges(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) { 
      toast.error(err.message); 
    }
  };

  const filteredData = useMemo(() => {
    return clubs.filter(c =>
      c.status === activeTab &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       c.shortForm.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.adminName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [clubs, activeTab, searchQuery]);

  if (loading) {
     return (
        <section className="mx-auto p-4 min-h-screen w-full bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Initialising Directory...</p>
            </div>
        </section>
     );
  }

  return (
    <div className="w-full space-y-10 pb-10">
        <ClubsHeader 
          totalClubs={clubs.length} 
          onSearch={setSearchQuery} 
        />

        <ClubsStatusTabs 
          availableStatuses={availableStatuses}
          activeTab={activeTab}
          clubs={clubs}
          onTabChange={setActiveTab}
        />

        {filteredData.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center shadow-sm">
             <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Users size={32} />
             </div>
             <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">No clubs found in {activeTab}</p>
          </div>
        ) : (
          <>
            <ClubsMobileList 
              clubs={filteredData} 
              onSelect={setSelectedClub} 
            />

            <ClubsTable 
              clubs={filteredData}
              availableStatuses={availableStatuses}
              pendingStatusChanges={pendingStatusChanges}
              onStatusChange={(id, status) => setPendingStatusChanges({ ...pendingStatusChanges, [id]: status })}
              onUpdateStatus={handleUpdateStatusDatabase}
            />
          </>
        )}

      {selectedClub && (
        <ClubDetailModal 
          club={selectedClub}
          availableStatuses={availableStatuses}
          pendingStatusChanges={pendingStatusChanges}
          onClose={() => setSelectedClub(null)}
          onStatusChange={(id, status) => setPendingStatusChanges({ ...pendingStatusChanges, [id]: status })}
          onUpdateStatus={handleUpdateStatusDatabase}
        />
      )}
    </div>
  );
};
