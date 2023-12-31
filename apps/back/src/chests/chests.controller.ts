import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { FirebaseAuthGuard } from '@whitecloak/nestjs-passport-firebase';
import { ChestsService } from './chests.service';

@Controller('chests')
export class ChestsController {
  constructor(private readonly chestsService: ChestsService) {}

  @Post('unbox')
  @UseGuards(FirebaseAuthGuard)
  async unbox(@Request() req: any): Promise<{ newPicUrl: string }> {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        throw new Error('ID non trouvé dans le jwt.');
      }

      const randomNewId = await this.chestsService.unlockNewId(userId);
      const newPicUrl = await this.chestsService.getPictureUrlById(randomNewId);

      return { newPicUrl };
    } catch (error) {
      console.error('Erreur lors du déblocage des nouvelles images :', error);
      throw error;
    }
  }
}
