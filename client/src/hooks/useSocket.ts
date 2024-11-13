import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User } from '../types';

export const useSocket = (user: User | null) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return; // Ensure user is defined before initializing socket

    socketRef.current = io('http://localhost:3000', {
      query: {
        'x-user-id': `${user.id}`,
        'x-user-name': user.username,
        'x-user-role': user.role,
      },
      transports: ['websocket'], // Ensure WebSocket transport is included
      path: '/socket', // Ensure path matches target server path
      
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null; // Clean up socket reference
    };
  }, [user]);

  // Return socket only if it has been initialized
  return socketRef.current;
};