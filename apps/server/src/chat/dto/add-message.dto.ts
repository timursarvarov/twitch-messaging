import { IsOptional, IsString } from 'class-validator';

export class AddMessageDto {
  @IsString()
  text: string;

  @IsOptional()
  userId: string;
}
