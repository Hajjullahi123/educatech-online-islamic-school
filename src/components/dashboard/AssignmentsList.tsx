"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, CheckCircle2, AlertCircle, Clock, Volume2, Award, ArrowUpRight } from 'lucide-react';

interface Assignment {
  id: string;
  studentId: string;
  title: string;
  description: string;
  dueDate: Date | string;
  status: string; // PENDING, SUBMITTED, GRADED
  audioUrl: string | null;
  grade: string | null;
  feedback: string | null;
  createdAt: Date | string;
}

interface AssignmentsListProps {
  initialAssignments: Assignment[];
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({ initialAssignments }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'SUBMITTED' | 'GRADED'>('ALL');
  
  // Recording states mapped per assignment ID
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [recordedAudios, setRecordedAudios] = useState<{ [key: string]: { blob: Blob; url: string } }>({});
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);
  const [isUploadingId, setIsUploadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Filtered assignments
  const filteredAssignments = assignments.filter(item => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  // Recording functions
  const startRecording = async (id: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudios(prev => ({
          ...prev,
          [id]: { blob: audioBlob, url: audioUrl }
        }));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecordingId(id);
      setRecordingDuration(0);

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Mic access error:', err);
      setErrorMsg('Microphone access denied or not supported in this browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingId(null);
  };

  const deleteRecording = (id: string) => {
    if (recordedAudios[id]) {
      URL.revokeObjectURL(recordedAudios[id].url);
      setRecordedAudios(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // Submission handler
  const submitAssignment = async (id: string) => {
    const record = recordedAudios[id];
    if (!record) return;

    setIsUploadingId(id);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Upload to File Upload Endpoint
      const formData = new FormData();
      formData.append('file', record.blob, `recitation-${id}.webm`);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || 'Failed to upload audio file.');
      }

      const { url: audioUrl } = await uploadRes.json();

      // 2. Submit Assignment with resulting audioUrl
      const submitRes = await fetch('/api/student/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: id, audioUrl })
      });

      if (!submitRes.ok) {
        const errData = await submitRes.json();
        throw new Error(errData.error || 'Failed to submit assignment.');
      }

      // Update local state status
      setAssignments(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, status: 'SUBMITTED', audioUrl };
        }
        return item;
      }));

      // Cleanup local blob url
      deleteRecording(id);
      setSuccessMsg('Recitation submitted successfully! Your teacher will review it shortly.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsUploadingId(null);
    }
  };

  // Play audio player
  const playAudio = (url: string, id: string) => {
    if (audioPlayerRef.current) {
      if (isPlayingId === id) {
        audioPlayerRef.current.pause();
        setIsPlayingId(null);
      } else {
        audioPlayerRef.current.src = url;
        audioPlayerRef.current.play();
        setIsPlayingId(id);
        
        audioPlayerRef.current.onended = () => {
          setIsPlayingId(null);
        };
      }
    }
  };

  useEffect(() => {
    // Audio element instantiation
    audioPlayerRef.current = new Audio();
    
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Revoke any created URLs to avoid memory leak
      Object.values(recordedAudios).forEach(r => URL.revokeObjectURL(r.url));
    };
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Messages */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-100 gap-6">
        {(['ALL', 'PENDING', 'SUBMITTED', 'GRADED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${
              activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Assignment Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] p-12 text-center text-slate-400">
          No assignments found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredAssignments.map(assignment => {
            const isRecording = recordingId === assignment.id;
            const hasLocalAudio = !!recordedAudios[assignment.id];
            const isUploading = isUploadingId === assignment.id;
            const isPlaying = isPlayingId === assignment.id;
            const dueDateObj = new Date(assignment.dueDate);
            const isOverdue = dueDateObj < new Date() && assignment.status === 'PENDING';

            return (
              <div
                key={assignment.id}
                className="glass bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between gap-6 relative overflow-hidden transition-all hover:translate-y-[-2px]"
              >
                {/* Header Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        assignment.status === 'PENDING' ? (isOverdue ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100') :
                        assignment.status === 'SUBMITTED' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}
                    >
                      {assignment.status === 'PENDING' ? (isOverdue ? 'Overdue' : 'Pending') : assignment.status}
                    </span>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due: {dueDateObj.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-800 leading-tight">{assignment.title}</h3>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2">{assignment.description}</p>
                  </div>
                </div>

                {/* Dynamic Interactions depending on Assignment Status */}
                <div className="border-t border-slate-50 pt-6">
                  {assignment.status === 'PENDING' && (
                    <div className="space-y-4">
                      {/* Interactive Mic Recorder */}
                      {!hasLocalAudio ? (
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          {isRecording ? (
                            <div className="flex items-center gap-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                              <span className="text-xs font-black text-slate-700 tracking-wider">Recording... {formatDuration(recordingDuration)}</span>
                              
                              {/* Simple CSS Waveform Pulsating */}
                              <div className="flex gap-0.5 items-end h-4">
                                <span className="w-0.5 h-2 bg-rose-500 animate-pulse" />
                                <span className="w-0.5 h-4 bg-rose-600 animate-pulse delay-75" />
                                <span className="w-0.5 h-1.5 bg-rose-500 animate-pulse delay-150" />
                                <span className="w-0.5 h-3 bg-rose-600 animate-pulse delay-200" />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">No audio recorded yet.</span>
                          )}

                          {isRecording ? (
                            <button
                              onClick={stopRecording}
                              className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all"
                            >
                              <Square className="w-4 h-4 fill-white" />
                            </button>
                          ) : (
                            <button
                              onClick={() => startRecording(assignment.id)}
                              disabled={recordingId !== null}
                              className="px-4 py-2 bg-primary text-white text-xs font-black uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
                            >
                              <Mic className="w-4 h-4" /> Record Recitation
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Playback Local recording */}
                          <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => playAudio(recordedAudios[assignment.id].url, assignment.id)}
                                className="p-2 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all"
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                              </button>
                              <span className="text-xs font-black text-primary-dark">Local Recitation Ready</span>
                            </div>

                            <button
                              onClick={() => deleteRecording(assignment.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              title="Delete Recording"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>

                          {/* Submit button */}
                          <button
                            onClick={() => submitAssignment(assignment.id)}
                            disabled={isUploading}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                          >
                            {isUploading ? (
                              <>
                                <Volume2 className="w-4 h-4 animate-bounce" /> Uploading Recitation...
                              </>
                            ) : (
                              <>
                                Submit Assignment <ArrowUpRight className="w-4.5 h-4.5" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submitted & Graded Display */}
                  {(assignment.status === 'SUBMITTED' || assignment.status === 'GRADED') && assignment.audioUrl && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-600">Your Submission Audio:</span>
                        <button
                          onClick={() => playAudio(assignment.audioUrl!, assignment.id)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3.5 h-3.5" /> Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-white" /> Play
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display Grades & Feedback */}
                      {assignment.status === 'GRADED' && (
                        <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teacher Evaluation</span>
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100/50 px-2.5 py-1 rounded-lg text-xs font-black">
                              <Award className="w-3.5 h-3.5" /> Grade: {assignment.grade || 'MashaAllah'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Feedback Remarks</span>
                            <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
                              "{assignment.feedback || 'Excellent recitation, keep practicing.'}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentsList;
