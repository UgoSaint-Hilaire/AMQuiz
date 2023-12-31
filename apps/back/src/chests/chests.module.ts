import { Module } from '@nestjs/common';
import { ChestsController } from './chests.controller';
import { ChestsService } from './chests.service';

@Module({
  controllers: [ChestsController],
  providers: [ChestsService],
})
export class ChestsModule {}
