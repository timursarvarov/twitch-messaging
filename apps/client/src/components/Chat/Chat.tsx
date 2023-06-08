import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useStore } from '../../state/storeHooks';

const socket: Socket = io('ws://localhost:3000', {
  autoConnect: false,
  query: {
    token: localStorage.getItem('accessToken'),
  },
});

function Chat() {
  const { user } = useStore(({ app }) => app);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoinedRoom, setIsJoinedRoom] = useState(false);
  const [isJoiningDelay, setIsJoiningDelay] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      socket.on('connect', () => {
        setIsJoiningDelay(true);
        setTimeout(() => {
          // default required 800 ms minimum join delay to prevent flickering
          setIsJoiningDelay(false);
        }, 800);
        socket.timeout(30000).emit('join', (err: any, response: any) => {
          if (response) {
            setIsJoinedRoom(true);
          }
        });
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('message', (e) => {
        setMessages((messages) => [{ ...e, delivered: true }, ...messages]);
        // if (e.user) {
        // }
      });

      socket.connect();
    }
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);

  return (
    <>
      chat
    </>
  );
}

export default Chat;
