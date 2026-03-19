import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserService } from './user.service';
import { UserDto } from 'src/dto';
import { ResolvedUserInput } from 'src/interfaces';
import { UserInputResolverService } from 'src/pipes/resolve-user.pipe';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userInputResolverService: UserInputResolverService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_image', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  async create(
    @Body() body: UserDto,
    @UploadedFiles()
    files: {
      profile_image?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
  ) {
    const input: ResolvedUserInput =
      this.userInputResolverService.resolveCreate(body, files);
    return await this.userService.createUser(input);
  }

  @Get()
  async findAll() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile_image', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() body: Partial<UserDto>,
    @UploadedFiles()
    files: {
      profile_image?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    },
  ) {
    const input: Partial<ResolvedUserInput> =
      this.userInputResolverService.resolveUpdate(body, files);
    return await this.userService.updateUser(id, input);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
