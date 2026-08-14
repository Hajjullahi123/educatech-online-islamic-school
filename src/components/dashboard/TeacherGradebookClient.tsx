"use client";

import React, { useState } from 'react';
import { User, ShieldCheck, CheckCircle2, AlertCircle, ChevronRight, Award, AlignLeft, Info } from 'lucide-react';

interface StudentRoster {
  id: string;
  name: string;
  email: string;
  currentLevel: string | null;
}

interface TeacherGradebookClientProps {
  students: StudentRoster[];
}

const TeacherGradebookClient: React.FC<TeacherGradebookClientProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentRoster | null>(students[0] || null);
  const [subject, setSubject] = useState<string>('');
  const [tajweedScore, setTajweedScore] = useState<number>(85);
  const [hifzScore, setHifzScore] = useState<number>(85);
  const [fluencyScore, setFluencyScore] = useState<number>(85);
  const [feedback, setFeedback] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (!subject || !feedback) {
      setErrorMsg('Please enter a subject evaluation title and feedback remarks.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/teacher/gradebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          subject,
          tajweedScore,
          hifzScore,
          fluencyScore,
          feedback
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit gradebook entry.');
      }

      setSuccessMsg(`Academic assessment for ${selectedStudent.name} saved successfully!`);
      // Reset form fields
      setSubject('');
      setTajweedScore(85);
      setHifzScore(85);
      setFluencyScore(85);
      setFeedback('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please check fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Left Column: Student List */}
      <div className="lg:col-span-5 space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          Active Students <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-0.5 rounded-full">{students.length}</span>
        </h3>

        {students.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center text-slate-400">
            No students currently enrolled in your classes.
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {students.map((student) => {
              const isActive = selectedStudent?.id === student.id;

              return (
                <div
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`glass p-5 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between ${
                    isActive ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/20 scale-[1.01]' : 'bg-white hover:bg-slate-50 border-slate-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {student.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-sm">{student.name}</h4>
                      <p className={`text-[10px] font-semibold tracking-wide mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {student.currentLevel || 'Intermediate'} Track
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-30'}`} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Grading Form */}
      <div className="lg:col-span-7 space-y-6">
        {selectedStudent ? (
          <div className="glass bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-50 pb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Enter Assessment Grade</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Assign scores to <span className="text-primary font-bold">{selectedStudent.name}</span> ({selectedStudent.email})
                </p>
              </div>
              <div className="bg-emerald-50 text-primary border border-emerald-100 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Grade Panel
              </div>
            </div>

            {/* Error/Success banners */}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Assessment Subject / Lesson</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surah Al-Kahf (Verses 1-15) Examination"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Sliders for grading metrics */}
              <div className="space-y-6 py-4 border-y border-slate-50">
                {/* Tajweed Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-600" /> Tajweed & Makharij</span>
                    <span className="text-slate-900 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100/50">{tajweedScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tajweedScore}
                    onChange={(e) => setTajweedScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>Needs Attention</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Hifz Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-600" /> Hifz / Memorization</span>
                    <span className="text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/50">{hifzScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hifzScore}
                    onChange={(e) => setHifzScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>Needs Attention</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Fluency Score */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-sky-600" /> Fluency & Tarteel</span>
                    <span className="text-slate-900 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100/50">{fluencyScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fluencyScore}
                    onChange={(e) => setFluencyScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>Needs Attention</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Sheikh Remarks / Feedback</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide guidance on improvement points, homework directions, or memorization reviews..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-slate-700 placeholder:text-slate-300 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all"
              >
                {isSubmitting ? 'Saving Evaluation...' : 'Submit Academic Evaluation'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center text-slate-400 flex flex-col justify-center items-center gap-3">
            <Info className="w-10 h-10 text-slate-300" />
            <p className="font-semibold text-sm">Please select a student from the roster list on the left to edit report cards.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGradebookClient;
