import { Socket, io } from 'socket.io-client';
import useChatService from '../../../services/chat.service';
import { useStore } from '../../../state/storeHooks';
import { ChatLayout } from '../../Layouts/chat.layout';
import { Messages } from '../../Messages/Messages';

const socket: Socket = io('ws://localhost:3000', {
  autoConnect: false,
  query: {
    token: localStorage.getItem('accessToken'),
  },
});

function Chat() {
  const { user } = useStore(({ app }) => app);
  const { isJoinedRoom, isJoiningDelay, isConnected, messages, sendMessage } =
    useChatService({ socket, user });
  return (
    // add if user is not logged in
    <ChatLayout>
      <div className="text-sm text-gray-400">
        'isConnected'{isConnected.toString()}
      </div>
      <div className="text-sm text-gray-400">
        'isJoiningDelay'{isJoiningDelay.toString()}
      </div>
      <div className="text-sm text-gray-400">
        'isJoinedRoom'{isJoinedRoom.toString()}
      </div>

      {!user ? (
        <div>not logged in</div>
      ) : (
        <Messages messages={messages} user={user} />
      )}
    </ChatLayout>
  );
}

export default Chat;
