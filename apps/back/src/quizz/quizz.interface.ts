/* eslint-disable prettier/prettier */
import { QuestionsModel } from '../questions/questions.interface';
import { UserModel } from '../user/user.interface';

export interface QuizzModel {
  // ID du Quizz
  id: number;
  // Thème du Quizz
  theme: string;
  // Questions du Quizz
  questions: QuestionsModel;
  // Joueurs du Quizz
  players: UserModel[];
}
