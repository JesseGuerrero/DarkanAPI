import {IsEmail, IsNotEmpty, Validate} from 'class-validator';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import {TitleExistsRule} from "../articles.service";

export class CreateArticleDto {
    @IsNotEmpty()
    @Validate(TitleExistsRule)
    title: string;

    type: number = 0;

    description: string;

    @IsNotEmpty()
    markdown: string;

    createdAt = new Date(Date.now());

    // slug: string;
    //
    // sanitizedHtml: string;
}
