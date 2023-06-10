import { UserForSignUpRes } from './../user/user';
export interface IMessage {
	_id: string;
	user: UserForSignUpRes;
	timeSent: number;
	text: string;
	delivered?: boolean;
	eventName?: string;
}

export interface MessageReq {
	userId: string;
	text: string;
}