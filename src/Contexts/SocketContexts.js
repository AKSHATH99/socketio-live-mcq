// context/SocketContext.js (or .ts if you're using TypeScript)
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketURL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    const socketInstance = io(socketURL, {
      withCredentials: true,
    });
    
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
