/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';

@Module({
  providers: [QuizzService],
  controllers: [QuizzController],
  exports: [QuizzService],
})
export class QuizzModule { }
