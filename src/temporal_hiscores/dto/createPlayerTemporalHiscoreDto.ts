import {IsEmail, IsNotEmpty, MaxLength, Validate} from 'class-validator';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import {TitleExistsRule} from "../temporal_hiscore.service";

export class CreatePlayerTemporalHiscoreDto {
    @IsNotEmpty()
    @MaxLength(12, {
        message: 'Username is too long.',
    })
    username: string;

    days: number;

    @IsNotEmpty()
    xp: Array<Number>;
}
