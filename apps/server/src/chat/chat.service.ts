
import { InjectRepository } from '@nestjs/typeorm';
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

	async getMessages(limit = 10) {
		return await this.messageRepository.find({
			order: {
				created_at: 'DESC',
			},
			take: limit,
		});
	}
	async addMessage(addMessageDto: AddMessageDto) {
		const { userId, text } = addMessageDto;

		const user = await this.userService.findOne(userId);

		const savedMessage = await this.messageRepository.create({
			text,
			user,
		});

		return this.messageRepository.save(savedMessage);
	}

}