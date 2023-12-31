interface QuestionsChoice {
  id: number;
  answer: string;
}

export interface QuestionsModel {
  // Le thème (ex: Naruto)
  [theme: string]: [
    {
      // Index de la question
      index: number;
      // Contenu de la question
      body: string;
      // Réponses possibles
      choices: QuestionsChoice[];
      // ID de la réponse correcte
      answerId: number;
    },
  ];
}
