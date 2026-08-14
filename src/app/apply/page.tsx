"use client";

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Calendar, CheckCircle, ArrowRight, ArrowLeft, Upload, AlertCircle, Mic, Square, Play, Trash2 } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ApplyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    riwayahPreference: 'Hafs',
    experience: '',
  });

  // Audio Recording & Upload states
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Audio visualization states and refs
  const [volumeLevel, setVolumeLevel] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio input devices states
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Enumerate audio input devices on load
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request a quick permission check to allow fetching labels
        const initialStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the initial check stream immediately
        initialStream.getTracks().forEach(track => track.stop());

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = allDevices.filter(device => device.kind === 'audioinput');
        setDevices(audioInputs);
        if (audioInputs.length > 0) {
          setSelectedDeviceId(audioInputs[0].deviceId);
        }
      } catch (err) {
        console.error('Failed to list audio devices:', err);
      }
    };
    
    // Only fetch devices in client browser environment
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      getDevices();
    }
  }, []);

  // Prefill user details if logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const startRecording = async () => {
    try {
      const constraints = selectedDeviceId 
        ? { audio: { deviceId: { exact: selectedDeviceId } } }
        : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Log track details to console for user troubleshooting
      const tracks = stream.getAudioTracks();
      console.log('Audio Tracks Found:', tracks.length);
      if (tracks.length > 0) {
        console.log('Track Label:', tracks[0].label);
        console.log('Track Enabled:', tracks[0].enabled);
        console.log('Track Muted (by system/browser):', tracks[0].muted);
        if (tracks[0].muted) {
          setError('Microphone is muted at the system level. Please unmute it in Windows settings.');
        }
      }

      // Initialize Web Audio API Analyser for real-time visual feedback
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64; // Small fftSize for simple volume level calculation

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Map average volume (0-255) to a scale of (0-100)
        const scale = Math.min(100, Math.round((average / 128) * 100));
        setVolumeLevel(scale);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioFileName('recorded-recitation.webm');
        
        // Force the audio player element to load the new Blob source buffer
        setTimeout(() => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.load();
          }
        }, 50);
      };

      setMediaRecorder(recorder);
      recorder.start(500); // Send data chunks every 500ms
      updateVolume();
      setIsRecording(true);
      setError('');
    } catch (err: any) {
      console.error(err);
      setError('Could not access microphone. Please check system permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }

    // Clean up analyser resources
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    setVolumeLevel(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setAudioFileName(file.name);
      setError('');
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.ageGroup) {
        setError('Please fill in your name, email, and age group.');
        return;
      }
      if (!session) {
        if (!formData.password || !formData.confirmPassword) {
          setError('Please specify a password.');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
      }
    }
    setError('');
    setStep(s => Math.min(s + 1, 3));
  };
  
  const prevStep = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setError('Please upload or record a recitation sample for placement evaluation.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Upload audio to /api/upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', audioBlob, audioFileName);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Failed to upload audio file');
      }

      const cloudAudioUrl = uploadData.url;

      // 2. Submit application details with uploaded URL
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: !session ? formData.password : undefined,
          ageGroup: formData.ageGroup,
          riwayahPreference: formData.riwayahPreference,
          experience: formData.experience,
          audioUrl: cloudAudioUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstErrorMsg = Object.values(data.errors).flat()[0] as string;
          throw new Error(firstErrorMsg || 'Validation failed');
        }
        throw new Error(data.message || 'Failed to submit application');
      }

      // If not logged in, auto sign-in with the credentials
      if (!session) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          router.push('/auth/login?registered=true&callbackUrl=/checkout');
          return;
        }
      }

      // Fetch pricing plans to find the Specialization plan
      const pricingRes = await fetch('/api/pricing');
      const pricingData = await pricingRes.json();
      const specPlan = pricingData.find((p: any) => p.name === 'Specialization') || pricingData[0];

      router.push(`/checkout?planId=${specPlan?.id || ''}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during submission.');
      setSubmitting(false);
    }
  };

  const RiwayahOptions = [
    { id: 'Hafs', name: 'Hafs an Asim', desc: 'Standard / Global' },
    { id: 'Warsh', name: 'Warsh an Nafi', desc: 'North Africa' },
    { id: 'Qalun', name: 'Qalun an Nafi', desc: 'Libya / Tunisia' },
    { id: 'Duri', name: 'Ad-Duri an Abu Amr', desc: 'East Africa / Sudan' },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <Navbar />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold mb-4 text-center text-slate-900">Join the Academy</h1>
            <p className="text-slate-500 text-center mb-10">Complete the application to begin your journey.</p>

            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-1 -translate-y-1/2" />
              <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-1 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />

              {[1, 2, 3].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= i ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                  {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100 font-bold max-w-2xl mx-auto">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="text-primary" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-800 ml-1">Full Name</label>
                      <input
                        type="text"
                        disabled={!!session}
                        placeholder="Abdullah Ahmad"
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 text-slate-900 placeholder-slate-400"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-800 ml-1">Email Address</label>
                      <input
                        type="email"
                        disabled={!!session}
                        placeholder="abdullah@example.com"
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-60 text-slate-900 placeholder-slate-400"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    {!session && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-800 ml-1">Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 placeholder-slate-400"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-800 ml-1">Confirm Password</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 placeholder-slate-400"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold opacity-60 ml-1">Age Group</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['5-12', '13-17', '18-24', '25+'].map(age => (
                        <button
                          key={age}
                          type="button"
                          onClick={() => setFormData({ ...formData, ageGroup: age })}
                          className={`py-3 px-4 rounded-xl border-2 transition-all font-bold ${formData.ageGroup === age ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white hover:border-primary/30 text-slate-600'}`}
                        >
                          {age === '25+' ? 'Adult' : age}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="text-primary" /> Learning Preferences
                  </h2>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold opacity-60 ml-1">Target Riwayah</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {RiwayahOptions.map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, riwayahPreference: opt.id })}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-1 ${formData.riwayahPreference === opt.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white hover:border-primary/30 text-slate-600'}`}
                        >
                          <span className="font-bold">{opt.name}</span>
                          <span className="text-xs opacity-60">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">Current Experience</label>
                    <textarea
                      placeholder="Tell us about your previous Quran studies..."
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px] text-slate-900 placeholder-slate-400"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <h2 className="text-2xl font-bold">Placement Submission</h2>
                  <p className="text-foreground/60">
                    To match you with the right teacher, please record yourself reciting 3 verses of Surah Al-Fatiha or any other portion, or upload a audio file.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
                    {/* Live Recorder */}
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col items-center justify-center space-y-4">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Option A: Live Voice Recorder</p>
                      
                      {isRecording ? (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="w-16 h-16 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                        >
                          <Square className="w-6 h-6 fill-white animate-pulse" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="w-16 h-16 bg-primary hover:bg-primary-light text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                          <Mic className="w-6 h-6" />
                        </button>
                      )}
                      
                      <p className="text-xs font-bold text-slate-600">
                        {isRecording ? 'Recording your voice... Click to Stop' : 'Click to start live recording'}
                      </p>

                      {isRecording && (
                        <div className="w-full max-w-[150px] space-y-1 mt-1">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <span>Mic Input</span>
                            <span className={volumeLevel > 5 ? 'text-emerald-600 font-black' : 'text-slate-400'}>
                              {volumeLevel > 5 ? 'Active' : 'Silent'}
                            </span>
                          </div>
                          <div className="bg-slate-200 h-2 w-full rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-75"
                              style={{ width: `${volumeLevel}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {!isRecording && devices.length > 0 && (
                        <div className="w-full max-w-[200px] space-y-1 mt-2">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block text-center">Microphone Source</label>
                          <select
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            className="w-full text-[10px] bg-white border border-slate-200 rounded-lg p-1.5 outline-none font-bold text-slate-700 text-center"
                          >
                            {devices.map((device, idx) => (
                              <option key={device.deviceId} value={device.deviceId}>
                                {device.label || `Microphone ${idx + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {!isRecording && (
                        <div className="text-[9px] text-slate-400 leading-normal max-w-[200px] mt-2 pt-2 border-t border-slate-100 text-center">
                          <span className="font-black text-amber-600 block mb-0.5">Microphone sending silence?</span>
                          If using a Remote Lab/VM, please ensure <span className="font-bold">Microphone Redirection</span> is enabled in your RDP client properties (Local Resources &gt; Remote Audio &gt; Record from this computer).
                        </div>
                      )}
                    </div>

                    {/* File Uploader */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all rounded-3xl flex flex-col items-center justify-center space-y-4 cursor-pointer group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="audio/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="w-16 h-16 bg-slate-100 group-hover:bg-primary/5 text-slate-400 group-hover:text-primary rounded-full flex items-center justify-center transition-all">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Option B: Upload Audio File</p>
                      <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-all">Click to select MP3, WAV, or WebM</p>
                    </div>
                  </div>

                  {/* Audio Playback & Info */}
                  {audioUrl && (
                    <div className="max-w-md mx-auto p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{audioFileName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Audio Loaded</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={clearAudio}
                          className="p-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-lg transition-all"
                          title="Remove recording"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full h-10 mt-1" />
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-2xl p-4 text-amber-800 text-sm font-medium border border-amber-100 max-w-sm mx-auto">
                    Application Fee: <span className="font-bold">$29.00</span> (Payable on next step)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={submitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-800 hover:bg-black/5 disabled:opacity-30'}`}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>

              <button
                type="button"
                onClick={step === 3 ? handleSubmit : nextStep}
                disabled={submitting || isRecording}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : step === 3 ? 'Proceed to Payment' : 'Continue'} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplyPage;
