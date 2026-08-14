"use client";

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SyncData {
  surah: number;
  verse: number;
  highlight: number | null;
}

export const useClassroomSync = (isTeacher: boolean, initialSync: SyncData) => {
  const [syncState, setSyncState] = useState<SyncData>(initialSync);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    console.log(`Connecting to Al-Qalam Sync Engine at ${socketUrl} as ${isTeacher ? 'Teacher' : 'Student'}...`);

    const socket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Successfully connected to WebSocket server');
      // Join a default demo class room for syncing coordinates
      socket.emit('classroom:join', { classId: 'demo-class', isTeacher });
    });

    socket.on('classroom:sync', (data: SyncData) => {
      // Students follow the teacher's navigation state
      if (!isTeacher) {
        setSyncState(data);
      }
    });

    socket.on('connect_error', (err) => {
      console.warn('Classroom sync connection error (will retry):', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [isTeacher]);

  const updateState = (newState: Partial<SyncData>) => {
    setSyncState(prev => {
      const updated = { ...prev, ...newState };

      if (isTeacher && socketRef.current) {
        socketRef.current.emit('classroom:sync', { classId: 'demo-class', ...updated });
      }

      return updated;
    });
  };

  return { syncState, updateState };
};
