import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
// import { QuizzService } from 'src/quizz/quizz.service';

export interface Player {
  pseudo: string;
  score: number;
}

export interface Room {
  id: string;
  players: Player[];
  winner?: string;
  looser?: string;
  indexQuestions: number;
}

@Injectable()
class RoomManagerService {
  // constructor(@Inject(QuizzService) private quizzService: QuizzService) {}

  private rooms: Room[] = [];
  public readonly MAX_USERS_IN_ROOM = 2;

  findOrCreateRoom(username: string): Room {
    // this.quizzService.create
    let room = this.rooms.find(
      (r) => r.players.length < this.MAX_USERS_IN_ROOM,
    );

    if (!room) {
      // Créer une nouvelle room
      room = { id: uuid(), players: [], indexQuestions: 0 };
      this.rooms.push(room);
    }

    // Ajouter l'utilisateur à la room
    room.players.push({ pseudo: username, score: 0 });

    return room;
  }

  findRoomById(roomId: string): Room {
    return this.rooms.find((room) => room.id === roomId);
  }

  incrementScore(roomId, pseudo: string, incrementBy: number): number {
    const room = this.findRoomById(roomId);

    const player = room.players.find((player) => player.pseudo === pseudo);

    if (!player) throw new Error('No player found');

    player.score += incrementBy;

    return player.score;
  }
}

export default RoomManagerService;
