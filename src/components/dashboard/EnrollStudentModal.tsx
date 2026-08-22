'use client';

import React, { useState } from 'react';
import { UserPlus, X, Check, Loader2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentEnrolled?: () => void;
}

export default function EnrollStudentModal({ isOpen, onClose, onStudentEnrolled }: EnrollStudentModalProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    currentLevel: 'Beginner',
    targetRiwayah: 'Hafs',
    learningGoals: 'Quran recitation & Tajweed mastery',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: formData.password || 'student123',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to enroll student');
      }

      setIsSuccess(true);
      if (onStudentEnrolled) onStudentEnrolled();
      router.refresh();

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          fullName: '',
          email: '',
          password: '',
          currentLevel: 'Beginner',
          targetRiwayah: 'Hafs',
          learningGoals: 'Quran recitation & Tajweed mastery',
        });
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during student enrollment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Enroll New Student</h2>
              <p className="text-xs text-slate-500 font-medium">Add and onboard a student to your school registry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Student Enrolled Successfully!</h3>
              <p className="text-xs text-slate-500 font-medium">The student has been added to your institution roster.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Student Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maryam Bilal"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="maryam@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Initial Password <span className="text-[10px] text-slate-400 font-normal">(Default: student123)</span>
                </label>
                <input
                  type="password"
                  placeholder="Leave blank for student123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Level</label>
                  <select
                    value={formData.currentLevel}
                    onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary transition-all font-medium"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Riwayah</label>
                  <select
                    value={formData.targetRiwayah}
                    onChange={(e) => setFormData({ ...formData, targetRiwayah: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary transition-all font-medium"
                  >
                    <option value="Hafs">Riwayah Hafs</option>
                    <option value="Warsh">Riwayah Warsh</option>
                    <option value="Qalun">Riwayah Qalun</option>
                    <option value="Al-Bazzi">Riwayah Al-Bazzi</option>
                    <option value="Qumbul">Riwayah Qumbul</option>
                    <option value="Ad-Duri">Riwayah Ad-Duri</option>
                    <option value="Al-Sousi">Riwayah Al-Sousi</option>
                    <option value="Hisham">Riwayah Hisham</option>
                    <option value="Ibn Zakwan">Riwayah Ibn Zakwan</option>
                    <option value="Khalaf">Riwayah Khalaf</option>
                    <option value="Khallad">Riwayah Khallad</option>
                    <option value="Shu'bah">Riwayah Shu'bah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Learning Goals / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Hifz Juz Amma, Tajweed foundation"
                  value={formData.learningGoals}
                  onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enrolling Student...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" /> Complete Enrollment
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
