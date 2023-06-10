import { IMessage, UserForSignUpRes } from '@twitch-messaging/shared';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';


interface IChatService {
  socket: Socket;
  user: UserForSignUpRes | null;
}

function useChatService({ socket, user }: IChatService) {
  const [isJoinedRoom, setIsJoinedRoom] = useState(false);
  const [isJoiningDelay, setIsJoiningDelay] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

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
        setMessages((messages) => [{ ...e.message, delivered: true }, ...messages]);
      });

      socket.on('join', (e) => {
        setMessages(() => [...e]);
      });

      socket.connect();
    }
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, [socket, user]);

  const sendMessage = (message: string) => {
    socket.emit('chatMessage', { user, text: message });
  };

  return {
    isJoinedRoom,
    isJoiningDelay,
    isConnected,
    messages,
    sendMessage,
  };
}

export default useChatService;
