"use client";

import React, { useEffect, useRef, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Video, Phone, ShieldAlert, Mic, MicOff, VideoOff, PhoneOff, Signal, Sparkles } from 'lucide-react';

interface LiveVideoProps {
  isTeacher: boolean;
  roomUrl?: string;
}

const LiveVideo: React.FC<LiveVideoProps> = ({ isTeacher, roomUrl: initialRoomUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [roomUrl, setRoomUrl] = useState(initialRoomUrl || '');
  const [joined, setJoined] = useState(false);
  const [isDemoCall, setIsDemoCall] = useState(false);
  const [error, setError] = useState('');

  // Demo call states
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);

  const handleStartCall = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If no URL is provided, launch the interactive demo call
    if (!roomUrl) {
      setIsDemoCall(true);
      setJoined(true);
      return;
    }

    setError('');
    
    try {
      if (!containerRef.current) return;

      // Create a Daily.co iframe call frame
      const call = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '2rem',
        },
        showLeaveButton: true,
      });

      setCallObject(call);

      // Join the specified room
      await call.join({ url: roomUrl });
      setJoined(true);
      setIsDemoCall(false);

      call.on('left-meeting', () => {
        setJoined(false);
        call.destroy();
        setCallObject(null);
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to Daily.co room.');
    }
  };

  const handleLeaveDemo = () => {
    setJoined(false);
    setIsDemoCall(false);
  };

  useEffect(() => {
    // Cleanup call frame on unmount
    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  // If a room URL is passed as a prop, join automatically
  useEffect(() => {
    if (initialRoomUrl && !joined) {
      setRoomUrl(initialRoomUrl);
      handleStartCall();
    }
  }, [initialRoomUrl]);

  return (
    <div className="h-full flex flex-col">
      {!joined ? (
        <div className="flex-1 glass bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Video className="w-8 h-8" />
          </div>
          
          <div className="space-y-2 max-w-sm">
            <h4 className="text-lg font-black text-slate-800">Live Video Studio</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Connect to your WebRTC live classroom session. Enter a room URL or leave it blank to launch in demo mode.
            </p>
          </div>

          <form onSubmit={handleStartCall} className="w-full max-w-xs space-y-4">
            <input
              type="url"
              placeholder="https://yourdomain.daily.co/room (Optional)"
              value={roomUrl}
              onChange={(e) => setRoomUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none text-slate-700"
            />
            
            {error && (
              <p className="text-[10px] text-rose-500 font-bold flex items-center justify-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all"
            >
              <Phone className="w-3.5 h-3.5" /> {roomUrl ? 'Connect WebRTC' : 'Launch Demo Stream'}
            </button>
          </form>

          <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pt-2">
            Powered by Daily.co WebRTC SDK
          </div>
        </div>
      ) : isDemoCall ? (
        /* GORGEOUS MOCK VIDEO CALL VIEW */
        <div className="flex-1 bg-slate-950 rounded-[2.5rem] p-6 shadow-2xl border-2 border-primary/15 flex flex-col justify-between relative overflow-hidden text-white min-h-[380px]">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5">
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider">REC</span>
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 text-xs font-bold text-emerald-400">
              <Signal className="w-3.5 h-3.5" /> Strong
            </div>
          </div>

          {/* Video Feeds Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 my-4 relative min-h-0">
            {/* Instructor Feed */}
            <div className="bg-slate-900 rounded-2xl relative overflow-hidden border border-white/5 shadow-inner flex flex-col items-center justify-center">
              <div className="text-4xl select-none mb-3">🕌</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sheikh Ahmad</span>
              <div className="absolute bottom-3 left-3 bg-black/55 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                Instructor
              </div>
              <div className="absolute bottom-3 right-3 bg-emerald-500 w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white/10">
                <Mic className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Student Feed */}
            <div className="bg-slate-900 rounded-2xl relative overflow-hidden border border-white/5 shadow-inner flex flex-col items-center justify-center">
              {videoActive ? (
                <>
                  <div className="text-4xl select-none mb-3">🎓</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zaid (You)</span>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <VideoOff className="w-6 h-6 text-slate-600 mx-auto" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/55 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                Student
              </div>
              <div className={`absolute bottom-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white/10 ${micActive ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {micActive ? <Mic className="w-3 h-3 text-white" /> : <MicOff className="w-3 h-3 text-white" />}
              </div>
            </div>
          </div>

          {/* Call Controls Panel */}
          <div className="flex items-center justify-center gap-3.5 z-10 shrink-0 bg-black/35 backdrop-blur-md py-3 px-6 rounded-full border border-white/5 w-fit mx-auto shadow-2xl">
            {/* Audio Toggle */}
            <button
              onClick={() => setMicActive(!micActive)}
              className={`p-3 rounded-full transition-all hover:scale-105 active:scale-95 ${
                micActive ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
              }`}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={() => setVideoActive(!videoActive)}
              className={`p-3 rounded-full transition-all hover:scale-105 active:scale-95 ${
                videoActive ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
              }`}
            >
              {videoActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            {/* Leave Call */}
            <button
              onClick={handleLeaveDemo}
              className="p-3 bg-rose-500 hover:bg-rose-600 rounded-full transition-all hover:scale-105 active:scale-95 text-white shadow-lg shadow-rose-500/20"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-primary/10 flex flex-col">
          {/* Iframe Mount Point */}
          <div ref={containerRef} className="flex-1 w-full h-full" />
        </div>
      )}
    </div>
  );
};

export default LiveVideo;
