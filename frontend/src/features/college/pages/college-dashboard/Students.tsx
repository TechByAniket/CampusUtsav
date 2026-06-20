import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { getAllStudentsByCollege } from '@/services/studentService';
import type { Student } from '@/services/studentService';
import { StudentsInfoList } from '../../components/StudentsInfoList';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

export const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const collegeId = useSelector((state: RootState) => state.auth.collegeId);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!collegeId) return;
      try {
        setLoading(true);
        const data = await getAllStudentsByCollege(collegeId);
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [collegeId]);

  if (loading) {
    return <PageSkeleton layout="table" />;
  }

  return (
    <div className="w-full space-y-10 pb-10">
        <StudentsInfoList students={students} />
    </div>
  );
};
