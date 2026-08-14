"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, PlayCircle, FileText, GraduationCap, Check, AlertCircle } from 'lucide-react';

interface ApplicationItem {
  id: string;
  type: string;
  status: string;
  createdAt: Date | string;
  submittedData: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ApplicationsClientListProps {
  initialApplications: ApplicationItem[];
}

const ApplicationsClientList: React.FC<ApplicationsClientListProps> = ({ initialApplications }) => {
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'SUCCESS' | 'ERROR'; text: string } | null>(null);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setLoadingId(id);
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      const data = await res.json();

      if (data.success) {
        // Remove from list
        setApplications(prev => prev.filter(app => app.id !== id));
        setToastMsg({
          type: 'SUCCESS',
          text: `Application was successfully ${action === 'APPROVE' ? 'approved and activated' : 'rejected'}.`
        });
      } else {
        setToastMsg({
          type: 'ERROR',
          text: data.error || 'Failed to update application.'
        });
      }
    } catch (err: any) {
      setToastMsg({
        type: 'ERROR',
        text: 'Network error occurred. Please try again.'
      });
    } finally {
      setLoadingId(null);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const parseSubmittedDetails = (submittedData: string) => {
    try {
      const data = JSON.parse(submittedData);
      let details = [];
      if (data.riwayahPreference) details.push(`Riwayah Preference: ${data.riwayahPreference}`);
      if (data.ageGroup) details.push(`Age Group: ${data.ageGroup}`);
      if (data.experience) details.push(`Experience: ${data.experience}`);
      if (data.riwayatMastery) details.push(`Riwayat Mastery: ${data.riwayatMastery.join(', ')}`);
      if (data.hourlyRate) details.push(`Hourly Rate: $${data.hourlyRate}/hr`);
      if (data.languages) details.push(`Languages: ${data.languages.join(', ')}`);
      
      return details.length > 0 ? details.join(' | ') : 'No details specified.';
    } catch (e) {
      return submittedData || 'No additional details.';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 relative">
      {toastMsg && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl z-50 border transition-all ${
          toastMsg.type === 'SUCCESS' ? 'bg-slate-950 text-white border-white/10' : 'bg-rose-600 text-white border-rose-500'
        }`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            toastMsg.type === 'SUCCESS' ? 'bg-emerald-500' : 'bg-white/20'
          }`}>
            {toastMsg.type === 'SUCCESS' ? <Check className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white" />}
          </div>
          <span className="text-xs font-black uppercase tracking-wider">{toastMsg.text}</span>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="glass bg-white p-20 rounded-[3rem] text-center border border-slate-100 flex flex-col items-center justify-center space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 opacity-20" />
          <p className="text-xl font-black text-slate-400">All caught up! No pending applications.</p>
        </div>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="glass bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-50">
              {/* Applicant Brief */}
              <div className="lg:w-1/3 p-8 space-y-6 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black ${app.type === 'TEACHER' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                    {(app.user.name || 'A')[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{app.user.name || 'Anonymous'}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">
                      {app.type === 'TEACHER' ? 'Faculty Application' : 'Student Enrollment'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</span>
                    <p className="text-sm font-bold text-slate-700">{app.user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission Date</span>
                    <p className="text-sm font-bold text-slate-700">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Data */}
              <div className="lg:w-1/2 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Qualification Details
                    </span>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[100px]">
                      <p className="text-xs font-bold text-slate-600 leading-relaxed">
                        {parseSubmittedDetails(app.submittedData)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Verification Artifacts
                    </span>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-primary" /> Recitation Sample</div>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" /> Ijazah Document (PDF)</div>
                        <Check className="w-4 h-4 text-emerald-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:w-1/6 p-8 flex lg:flex-col items-center justify-center gap-4">
                {loadingId === app.id ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Updating...</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction(app.id, 'REJECT')}
                      className="flex-1 w-full flex items-center justify-center gap-2 py-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-sm hover:bg-rose-100 transition-all"
                    >
                      <XCircle className="w-5 h-5" /> Reject
                    </button>
                    <button
                      onClick={() => handleAction(app.id, 'APPROVE')}
                      className="flex-1 w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <CheckCircle className="w-5 h-5" /> Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationsClientList;
