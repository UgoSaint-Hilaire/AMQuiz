/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { QuizzModel } from './quizz.interface';
import { questions } from '../questions/questions.db';
 
@Injectable()
export class QuizzService {
  // Liste des quizzs
  private quizzs: QuizzModel[] = [];

  // Constructeur
  constructor() {
    this.loadQuizzs();
  }

  // Charge la collection des Quizzs de Firebase
  private async loadQuizzs(): Promise<void> {
    if (this.quizzs.length === 0) {
      try {
        const quizzCollection = await admin.firestore().collection('Quizz').get();
        quizzCollection.forEach((doc) => {
          const quizzData = doc.data() as QuizzModel;
          quizzData.questions = questions[quizzData.theme];
          this.quizzs.push(quizzData);
        });
      } catch (error) {
        console.error(error);
        throw new Error('Erreur lors du chargement des quizzs');
      }
    }
  }

  // Récupère toutes les instances de quizz
  public findAll(): Array<QuizzModel> {
    // const temporaire pour test
    const testQuizz: QuizzModel = {
      id: 417,
      questions: {},
      players: [],
      theme: ''
    };

    return [testQuizz, ...this.quizzs];
  }

  // Récupère un quizz par son ID
  public findOne(id: number): QuizzModel {
    const quizz: QuizzModel = this.quizzs.find((quizz) => quizz.id === id);

    if (!quizz) {
      throw new NotFoundException('Quizz not found.');
    }

    return quizz;
  }

  // Créer un quizz
  public create(quizz: QuizzModel): QuizzModel {
    // Récupère le premier ID disponible 
    const maxId: number = Math.max(...this.quizzs.map((quizz) => quizz.id), 0);
    const id: number = maxId + 1;
    const newQuizz: QuizzModel = {
      ...quizz,
      id,
    };
    // Ajout du quizz créér au quizzs existants
    this.quizzs.push(newQuizz);
    return newQuizz;
  }

  // Modifie un quizz existant
  public update(id: number, quizz: QuizzModel): QuizzModel {
    const index: number = this.quizzs.findIndex((quizz) => quizz.id === id);

    // Pas de quizz correspondant
    if (index === -1) {
      throw new NotFoundException('Quizz introuvable');
    }
    const quizzUpdate: QuizzModel = {
      ...quizz,
      id,
    };

    return quizz;
  }
}
