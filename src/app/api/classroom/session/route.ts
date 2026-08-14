import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import axios from 'axios';

const DAILY_API_KEY = process.env.DAILY_API_KEY;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomName } = await req.json();

    // Fall back to simulation if API key is not present in local dev
    if (!DAILY_API_KEY) {
      console.warn('DAILY_API_KEY is not set. Falling back to simulated room credentials.');
      const mockRoomUrl = `https://alqalam.daily.co/${roomName || 'demo-room'}`;
      const mockToken = 'simulated_daily_token_' + Math.random().toString(36).substring(7);
      return NextResponse.json({
        url: mockRoomUrl,
        token: mockToken,
      });
    }

    const targetRoomName = roomName || 'demo-room';

    // Call real Daily.co API to create a room
    let roomUrl = '';
    try {
      const roomResponse = await axios.post(
        'https://api.daily.co/v1/rooms',
        {
          name: targetRoomName,
          privacy: 'private',
          properties: {
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
            enable_chat: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${DAILY_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      roomUrl = roomResponse.data.url;
    } catch (roomError: any) {
      // If the room already exists, Daily.co returns 400. In this case, construct the URL.
      if (roomError.response?.status === 400 && roomError.response?.data?.info?.includes('already exists')) {
        roomUrl = `https://alqalam.daily.co/${targetRoomName}`;
      } else {
        throw roomError;
      }
    }

    // Create a meeting token for the teacher/student to join private room
    const tokenResponse = await axios.post(
      'https://api.daily.co/v1/meeting-tokens',
      {
        properties: {
          room_name: targetRoomName,
          is_owner: (session.user as any).role === 'TEACHER', // Grants moderation permissions to teachers
          user_name: session.user.name || 'User',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({
      url: roomUrl,
      token: tokenResponse.data.token,
    });
  } catch (error: any) {
    console.error('Daily.co Session Error:', error.response?.data || error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
