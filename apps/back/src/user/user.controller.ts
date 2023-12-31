/* eslint-disable prettier/prettier */
import { Controller, Get, Put, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public findAll(): Array<UserModel> {
    console.log('[USER] - findAll()');
    return this.userService.findAll();
  }

  @Get(':uid')
  public findOne(@Param('uid') uid: string): UserModel {
    console.log('[USER] - findOne()');
    return this.userService.findOne(uid);
  }

  // TODO: à voir si utile
  // Renvoi vers la liste des coups spéciaux du joueur
  @Get(':uid/skills')
  public findSkills(@Param('uid') uid: string): string[] {
    console.log('[USER] - findSkills()');
    return this.userService.findOne(uid).skills;
  }

  @Put(':uid')
  public create(user: UserModel): UserModel {
    console.log('[USER] - create()');
    return this.userService.create(user);
  }

  @Delete(':uid')
  public delete(@Param('uid') uid: string): void {
    console.log('[USER] - delete()');
    this.userService.delete(uid);
  }

  @Put(':uid')
  public update(@Param('uid') uid: string, user: UserModel): UserModel {
    console.log('[PLAYER] - update()');
    return this.userService.update(uid, user);
  }
}
