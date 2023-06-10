
import { InjectRepository } from '@nestjs/typeorm';
import { IMessage, UserForMessageRes } from '@twitch-messaging/shared';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { AddMessageDto } from './dto/add-message.dto';
import { Message } from './entities/message.entity';

export class ChatService {
	constructor(
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		private readonly userService: UserService,
	) { }

	async getMessages(limit = 10, userId: string): Promise<IMessage[]> {
		const user = await this.getUserForMessage(userId)
		const messages: Message[] = await this.messageRepository.find({
			order: {
				timeSent: 'DESC',
			},
			take: limit,
		});

		return messages.map(message => {
			return {
				_id: message._id,
				...message,
				user,
			} as unknown as IMessage;
		})
	}
	async addMessage(addMessageDto: AddMessageDto) {
		const { userId, text } = addMessageDto;


		const user = await this.getUserForMessage(userId)

		const savedMessage = await this.messageRepository.create({
			text,
			user
		});

		return this.messageRepository.save(savedMessage);
	}

	private async getUserForMessage(userId: string): Promise<UserForMessageRes> {
		const userFromBase = await this.userService.findOne(userId);
		const user = {
			userId: userFromBase._id.toString(),
			username: userFromBase.username,
			email: userFromBase.email,
		}
		return user;
	}

}