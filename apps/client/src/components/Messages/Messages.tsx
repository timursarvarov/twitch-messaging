import { IMessage, UserForSignUpRes } from '@twitch-messaging/shared';

export type ClientMessage = IMessage;

const determineMessageStyle = (
  user: UserForSignUpRes,
  messageUserId: IMessage['user']['_id']
) => {
  if (user && messageUserId === user._id) {
    return {
      message: 'bg-slate-500 p-4 ml-24 rounded break-words',
      sender: 'ml-24 pl-4',
    };
  } else {
    return {
      message: 'bg-slate-800 p-4 mr-24 rounded break-words',
      sender: 'mr-24 pl-4',
    };
  }
};

export const Messages = ({
  user,
  messages,
}: {
  user: UserForSignUpRes;
  messages: ClientMessage[];
}) => {
  return (
    <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
      {messages?.map((message, index) => {
        return (
          <div key={message._id + index} className="mb-4">
            <div
              className={determineMessageStyle(user, message?.user?._id).sender}
            >
              <span className="text-sm text-gray-400">
                {message?.user?.username}
              </span>
              <span className="text-sm text-gray-400">{' ' + '•' + ' '}</span>
              <span className="text-sm text-gray-400">
                {new Date(message.timeSent).toLocaleString()}
              </span>
            </div>
            <div
              className={
                determineMessageStyle(user, message?.user?._id).message
              }
            >
              <p className="text-white">{message.text}</p>
            </div>
            {user && message?.user?._id === user._id && (
              <p className="text-right text-xs text-gray-400">
                {message.delivered ? 'Delivered' : 'Not delivered'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
