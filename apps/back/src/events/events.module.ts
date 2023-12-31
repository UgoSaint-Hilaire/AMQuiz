import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import RoomManagerService from './room.service';

@Module({
  providers: [EventsGateway, RoomManagerService],
})
export class EventsModule {}
