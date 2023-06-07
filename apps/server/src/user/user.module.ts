import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { Message } from '../chat/entities/message.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Message])],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
