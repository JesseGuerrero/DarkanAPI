import {IsEmail, IsNotEmpty, MaxLength, Validate} from 'class-validator';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

class Player {
    displayName: string
    ironman: boolean
    totalLevel: Number
    totalXp: Number
    xp: Array<Number>
}

export class CreateTemporalHiscoreDto {
    @IsNotEmpty()
    days_back: Number;

    @IsNotEmpty()
    hiscore: Array<Player>;
}
