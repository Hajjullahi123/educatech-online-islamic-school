"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Check, CheckCircle2, AlertCircle, Users, BookOpen, Clock } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  currentLevel: string | null;
}

interface ClassData {
  id: string;
  type: string;
  riwayah: string;
  level: string;
  schedule: string;
  students: StudentData[];
}

interface TeacherAttendanceClientProps {
  initialClasses: ClassData[];
}

const TeacherAttendanceClient: React.FC<TeacherAttendanceClientProps> = ({ initialClasses }) => {
  const [classes] = useState<ClassData[]>(initialClasses);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(classes[0] || null);
  
  // Keep attendance records: { [studentId]: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT' }
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: string }>({});
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize records when class selection changes
  useEffect(() => {
    if (selectedClass) {
      const initialRecords: { [key: string]: string } = {};
      selectedClass.students.forEach(s => {
        initialRecords[s.id] = 'PRESENT'; // default to Present
      });
      setAttendanceRecords(initialRecords);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [selectedClass]);

  const updateStatus = (studentId: string, status: 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    if (!selectedClass) return;
    const allPresent: { [key: string]: string } = {};
    selectedClass.students.forEach(s => {
      allPresent[s.id] = 'PRESENT';
    });
    setAttendanceRecords(allPresent);
  };

  const handleSave = async () => {
    if (!selectedClass) return;

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const listPayload = Object.entries(attendanceRecords).map(([studentId, status]) => ({
      studentId,
      status
    }));

    try {
      const res = await fetch('/api/teacher/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass.id,
          attendanceList: listPayload
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit attendance registry.');
      }

      setSuccessMsg('Attendance register submitted successfully! Logs have been updated.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const parseSchedule = (scheduleStr: string) => {
    try {
      const sched = JSON.parse(scheduleStr);
      if (sched.day && sched.time) return `${sched.day} at ${sched.time}`;
      return scheduleStr;
    } catch (e) {
      return scheduleStr;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Horizontal Class Selector cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Choose Class Session</h3>
        
        {classes.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 text-center text-slate-400">
            You do not have any teaching sessions assigned.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const isSelected = selectedClass?.id === cls.id;
              
              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls)}
                  className={`glass p-6 rounded-[2.5rem] border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                    isSelected ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/20 scale-[1.01]' : 'bg-white hover:bg-slate-50 border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {cls.type} Session
                    </span>
                    <h4 className="font-black text-base leading-tight">Riwayah {cls.riwayah}</h4>
                    <p className={`text-[10px] font-bold ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      Level: {cls.level}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold border-t border-slate-50/10 pt-4 mt-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {parseSchedule(cls.schedule)}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {cls.students.length} Students</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Roster Panel */}
      {selectedClass && (
        <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Students Attendance Checklist</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Class Track: <span className="text-primary font-bold">Riwayah {selectedClass.riwayah}</span> ({selectedClass.level})
              </p>
            </div>

            <button
              onClick={markAllPresent}
              className="bg-emerald-50 hover:bg-emerald-100 text-primary border border-emerald-100 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all self-start"
            >
              <Check className="w-4 h-4" /> Mark All Present
            </button>
          </div>

          {/* Banners */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-6 py-4 rounded-l-xl">Student</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 text-center rounded-r-xl">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {selectedClass.students.map((student) => {
                  const currentStatus = attendanceRecords[student.id] || 'PRESENT';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/30 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-xs">
                            {student.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs font-semibold text-slate-500">
                        {student.currentLevel || 'Intermediate'} Track
                      </td>
                      <td className="px-6 py-5">
                        {/* Selector toggles */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {[
                            { name: 'PRESENT', code: 'Present', styles: 'bg-emerald-50 text-emerald-700 border-emerald-100 active:bg-emerald-600 active:text-white', activeStyles: 'bg-emerald-600 text-white border-transparent' },
                            { name: 'LATE', code: 'Late', styles: 'bg-amber-50 text-amber-700 border-amber-100 active:bg-amber-600 active:text-white', activeStyles: 'bg-amber-600 text-white border-transparent' },
                            { name: 'EXCUSED', code: 'Excused', styles: 'bg-sky-50 text-sky-700 border-sky-100 active:bg-sky-600 active:text-white', activeStyles: 'bg-sky-600 text-white border-transparent' },
                            { name: 'ABSENT', code: 'Absent', styles: 'bg-rose-50 text-rose-700 border-rose-100 active:bg-rose-600 active:text-white', activeStyles: 'bg-rose-600 text-white border-transparent' }
                          ].map((opt) => {
                            const isCurrent = currentStatus === opt.name;
                            
                            return (
                              <button
                                key={opt.name}
                                onClick={() => updateStatus(student.id, opt.name as any)}
                                className={`px-2.5 sm:px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all shadow-sm ${
                                  isCurrent ? opt.activeStyles : `${opt.styles} hover:opacity-85`
                                }`}
                              >
                                {opt.code}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Submit */}
          <div className="border-t border-slate-50 pt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all"
            >
              {isSaving ? 'Submitting Registry...' : 'Save Class Attendance Register'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendanceClient;
