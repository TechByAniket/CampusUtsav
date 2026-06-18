import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Loader2
} from 'lucide-react';

import type { RootState } from '@/store/store';
import {
  getEventAttendance,
  getAttendanceToken,
  startAttendance,
  stopAttendance,
  getEventAttendanceStatus
} from '@/services/eventAttendanceService';
import { getEventDetailsByEventId } from '@/services/eventService';
import { getAllBranchesOfCollege } from '@/services/collegeService';
import type { AdminEventDetail } from '@/types/event';
import { AttendanceHeader } from '../components/AttendanceHeader';
import { AttendanceQRModal } from '../components/AttendanceQRModal';
import { AttendanceTable, type Attendee } from '../components/AttendanceTable';

export const AttendancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const role = useSelector((state: RootState) => state.auth.role);

  const [attendanceActive, setAttendanceActive] = useState(false);
  const [sessionTimes, setSessionTimes] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [token, setToken] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [event, setEvent] = useState<AdminEventDetail | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingToken, setFetchingToken] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showQrModal, setShowQrModal] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const isClubAdmin = role === 'ROLE_CLUB';

  const fetchToken = useCallback(async () => {
    try {
      setFetchingToken(true);
      const response = await getAttendanceToken(id);
      const tokenString = typeof response === 'string' ? response : response.token;
      setToken(tokenString);
      setTimeLeft(30);
    } catch (error: any) {
      console.error("Token fetch failed", error);
    } finally {
      setFetchingToken(false);
    }
  }, [id]);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [attData, eventData] = await Promise.all([
        getEventAttendance(id),
        getEventDetailsByEventId(id)
      ]);
      setAttendees(attData.attendees || []);
      setEvent(eventData);

      try {
        const statusData = await getEventAttendanceStatus(id);
        setAttendanceActive(statusData.active);
        setSessionTimes({ start: statusData.startTime, end: statusData.endTime });
        setErrorNotice(null);
      } catch (statusError: any) {
        console.warn("Status fetch failed:", statusError.message);
        setAttendanceActive(false);
        const rawMsg = statusError.message || "";
        const cleanMsg = rawMsg.includes("Something went wrong:") 
          ? rawMsg.split("Something went wrong:")[1].trim()
          : rawMsg.includes("Failed to fetch attendance status:")
          ? rawMsg.split("Failed to fetch attendance status:")[1].trim()
          : rawMsg;
        setErrorNotice(cleanMsg);
      }

      try {
        const branchesData = await getAllBranchesOfCollege(eventData.collegeId);
        if (typeof branchesData === 'object' && !Array.isArray(branchesData)) {
          setBranches(Object.values(branchesData));
        } else {
          setBranches(branchesData);
        }
      } catch (branchError) {
        console.error("Failed to fetch branches", branchError);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch critical data");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timer: ReturnType<typeof setInterval>;

    if (attendanceActive) {
      fetchToken();
      interval = setInterval(fetchToken, 30000);
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 30));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timer) clearInterval(timer);
    };
  }, [attendanceActive, fetchToken]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const handleStart = async () => {
    try {
      await startAttendance(id);
      setAttendanceActive(true);
      setShowQrModal(true);
      fetchData(true);
      toast.success("Attendance session started");
    } catch (error: any) {
      toast.error(error.message || "Failed to start attendance");
    }
  };

  const handleStop = async () => {
    try {
      await stopAttendance(id);
      setAttendanceActive(false);
      setToken(null);
      setShowQrModal(false);
      fetchData(true);
      toast.success("Attendance session stopped");
    } catch (error: any) {
      toast.error(error.message || "Failed to stop attendance");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Synchronizing Intelligence...</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <section className="w-full min-h-screen bg-slate-50/30 pt-0 pb-10 px-4 md:px-10 lg:px-16 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 -mt-6">
      <div className="max-w-[1550px] mx-auto space-y-12 relative">
        <AttendanceHeader 
          event={event}
          attendanceActive={attendanceActive}
          isClubAdmin={isClubAdmin}
          loading={loading}
          errorNotice={errorNotice}
          timeLeft={timeLeft}
          onStart={handleStart}
          onStop={handleStop}
          onDisplayQr={() => setShowQrModal(true)}
          onSync={() => fetchData(true)}
        />

        <div className="pt-2">
          <AttendanceTable 
            attendees={attendees} 
            loading={loading} 
            availableBranches={branches}
          />
        </div>
      </div>

      <AttendanceQRModal 
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        event={event}
        currentTime={currentTime}
        fetchingToken={fetchingToken}
        token={token}
        sessionTimes={sessionTimes}
        timeLeft={timeLeft}
      />
    </section>
  );
};


