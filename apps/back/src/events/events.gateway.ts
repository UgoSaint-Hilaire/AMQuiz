import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as RawSocket } from 'socket.io';
import RoomManagerService, { Room } from './room.service';

export type ClientToServerEvents = {
  searchRoom: (payload: string) => void;
  playerSendResponse: (
    payload: number,
    callback: (score: number) => void,
  ) => void;
  playerGoNextQuestion: (
    payload: number,
    callback: (score: number) => void,
  ) => void;
};

// Recupere le premier parametre dans la definition des fonction
// ClientToServer (correspond aux donnees envoyees par le client)
type PayloadForEvent<T extends keyof ClientToServerEvents> = Parameters<
  ClientToServerEvents[T]
>[0];

type ResponseForEvent<T extends keyof ClientToServerEvents> = Parameters<
  ClientToServerEvents[T]
>[1] extends (response: infer U) => void
  ? U
  : void;

export type ServerToClientEvents = {
  playerJoined: () => void;
  nextQuestion: () => void;
  endOfQuiz: (room: Room) => void;
  nextQuestionREAL: () => void;
  roomStatusUpdated: (status: {
    players: string[];
    roomCurrentPlayers: number;
    roomMaxPlayers: number;
  }) => void;
};

export type SocketData = {
  roomId?: string;
  index?: number;
  username?: string;
};

export type Socket = RawSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  unknown,
  SocketData
>;

@WebSocketGateway(4001, { cors: { origin: '*' } })
export class EventsGateway {
  constructor(private readonly roomManagerService: RoomManagerService) {}

  @WebSocketServer()
  server: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    unknown,
    SocketData
  >;

  @SubscribeMessage('searchRoom')
  onSearchRoom(
    @MessageBody() payload: PayloadForEvent<'searchRoom'>,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('searchRoom', payload, client.id);

    // Logique pour rejoindre une room
    const room = this.roomManagerService.findOrCreateRoom(payload);
    const roomKey = `room/${room.id}`;

    client.join(roomKey);
    client.data.roomId = room.id;

    if (!client.data.username) {
      client.data.username = payload;
    }

    this.server.to(roomKey).emit('roomStatusUpdated', {
      players: [],
      roomCurrentPlayers: 1,
      roomMaxPlayers: this.roomManagerService.MAX_USERS_IN_ROOM,
    });

    this.server.to(client.id).emit('playerJoined');

    if (room.players.length === this.roomManagerService.MAX_USERS_IN_ROOM) {
      this.server.to(roomKey).emit('nextQuestion');
    }
  }

  @SubscribeMessage('playerSendResponse')
  onPlayerSendResponse(
    @MessageBody() payload: PayloadForEvent<'playerSendResponse'>,
    @ConnectedSocket() client: Socket,
  ): ResponseForEvent<'playerSendResponse'> {
    const room = this.roomManagerService.findRoomById(client.data.roomId);
    const idGoodAnswers: number[] = [3, 4, 1, 2, 4, 1, 3, 3, 4, 4];
    let scoreIncrement: number;
    if (payload === idGoodAnswers[room.indexQuestions]) {
      scoreIncrement = +5;
    } else {
      scoreIncrement = -5;
    }

    const newPlayerScore = this.roomManagerService.incrementScore(
      client.data.roomId,
      client.data.username,
      scoreIncrement,
    );
    room.indexQuestions += 1;

    const roomKey = `room/${client.data.roomId}`;
    if (room.indexQuestions === 10) {
      if (room.players[0].score > room.players[1].score) {
        room.winner = room.players[0].pseudo;
        room.looser = room.players[1].pseudo;
      } else {
        room.winner = room.players[1].pseudo;
        room.looser = room.players[0].pseudo;
      }
      console.log('winner: ' + room.winner);
      this.server.to(roomKey).emit('endOfQuiz', room);
    } else {
      this.server.to(roomKey).emit('nextQuestionREAL');
    }

    return newPlayerScore;
  }
}
