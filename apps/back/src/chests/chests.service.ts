import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ChestsService {



async getAllPictureIds(): Promise<string[]> {
    const pictureCollection = admin.firestore().collection('Pictures');
    const documentRefs = await pictureCollection.listDocuments();
    const pictureIds: string[] = [];

    // Parcours de chaque document
    for (const docRef of documentRefs) {
      // Obtention des données du document
      const snapshot = await docRef.get();

      // Vérification de l'existence du document avant d'extraire l'ID
      if (snapshot.exists) {
        // Ajout de l'ID du document à la liste
        const id = snapshot.get('id');
        if (id) {
          pictureIds.push(id.toString());
        }
      }
      else {
        console.log('Document introuvable');
      }
    }
    return pictureIds;
  }

  async getUnlockedPictureIds(userId: string): Promise<string[]> {
    try {
      const userDocRef = admin.firestore().collection('Users').doc(userId);
      const userSnapshot = await userDocRef.get();

      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        //onsole.log(userData.comChestCount);
        

        if (userData?.userPics && Array.isArray(userData.userPics)) {
          // Retourne le tableau d'IDs débloqués
          return userData.userPics.map((id) => id.toString());
        }
      }
    }
      catch (error) {
      console.error('Erreur lors de la récupération des IDs débloqués :', error);
      throw error;
    }
  }


  async unlockNewId(userId: string): Promise<number> {
    try {
      // IDs de toutes les images
      const picturesIds = await this.getAllPictureIds();

      // IDs d'images débloquées par l'utilisateur
      const userPicsIds = await this.getUnlockedPictureIds(userId);

      // Filtrer les nouveaux IDs débloqués
      const filterIds = picturesIds.filter((id) => !userPicsIds.includes(id));

      if (filterIds.length === 0) {
        throw new Error('Aucun nouvel ID disponible.');
      }

      // Sélection d'un ID aléatoire parmi les nouveaux IDs débloqués
      const randomArrValue = filterIds[Math.floor(Math.random() * filterIds.length)];
      const randomNewId = parseInt(randomArrValue);
      console.log(filterIds);
      console.log(randomNewId);

      // Ajout à la bdd
      const userDocRef = admin.firestore().collection('Users').doc(userId);
      const userSnapshot = await userDocRef.get();
      const userData = userSnapshot.data();
      userData.userPics.push(...randomArrValue);
      console.log('Id envoyé dans userPics');

      await userDocRef.update({ userPics: userData.userPics });

      await this.decrementChestCount(userId);
      await this.getPictureUrlById(randomNewId);

      return randomNewId;


    } catch (error) {
      console.error('Erreur lors du déblocage d\'un nouvel ID et de la mise à jour de la base de données :', error);
      throw error;
    }
  }

  async getPictureUrlById(randomNewId: number): Promise<string> {
    try {
      const picturesCollection = admin.firestore().collection('Pictures');
      const pictureSnapshots = await picturesCollection.get();
      let imageUrl: string | null = null;

      pictureSnapshots.forEach((pictureSnapshot) => {
        const pictureData = pictureSnapshot.data();
        const pictureIds = pictureData?.id;

      if (pictureIds == randomNewId) {
        imageUrl = pictureData?.url;
        //console.log(imageUrl);
      }
    });

      if (imageUrl !== null) {
        return imageUrl.toString();
      } 
      else {
        console.error(`Aucune URL trouvée pour l'ID ${randomNewId}`);
        return null;
      }
    } 
    catch (error) {
      console.error(`Erreur lors de la récupération de l'URL :`, error);
    throw error;
    }
  }


  async decrementChestCount(userId: string): Promise<void> {
    const userDocRef = admin.firestore().collection('Users').doc(userId);
    const userSnapshot = await userDocRef.get();
    
    if (userSnapshot.exists) {
      const userData = userSnapshot.data();
  
      // Vérifier si comChestCount existe et est un nombre
      if (userData && typeof userData.comChestCount === 'number') {
        const comChestCount = userData.comChestCount;
        const newChestCount = comChestCount - 1;
  
        // Mettre à jour la base de données
        await userDocRef.update({ comChestCount: newChestCount });
        console.log('Décrémentation du nombre de coffres');
      } else {
        console.error('Le champ comChestCount est absent ou n\'est pas un nombre dans les données de l\'utilisateur.');
        throw new Error('Erreur lors de la récupération du comChestCount.');
      }
    } else {
      console.error('Le snapshot de l\'utilisateur n\'existe pas.');
      throw new Error('Erreur lors de la récupération du comChestCount.');
    }
  }

}
