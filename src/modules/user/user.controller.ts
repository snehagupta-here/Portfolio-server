import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { SearchUserQueryDto, UpdateUserDto } from 'src/dto';

import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.getAllUsers();
  }

  @Get('search')
  async search(@Query() query: SearchUserQueryDto) {
    return await this.userService.searchUsers(query);
  }

  @Get(':id/download-resume')
  async downloadResume(@Param('id') id: string, @Res() res: Response) {
    const resume = await this.userService.downloadResume(id);

    res.set({
      'Content-Type': resume.contentType,
      'Content-Disposition': `attachment; filename="${resume.fileName}"`,
      'Content-Length': resume.buffer.length.toString(),
    });

    return res.send(resume.buffer);
  }

  @Get(':id/contributions')
  getContributions(@Param('id') id: string, @Query('year') year?: string) {
    console.log("Received year query parameter:", year);
    const selectedYear = year ? Number(year) : new Date().getFullYear();

    return this.userService.getContributions(id,selectedYear);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
