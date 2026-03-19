import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CloudinaryProvider } from '../../common/cloudinary/cloudinary.provider';
import { ImageResolverService } from '../../common/image/image-resolver.service';
import { ImageValidationService } from '../../common/image/image-validation.service';
import { UserInputResolverService } from 'src/pipes/resolve-user.pipe';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    CloudinaryProvider,
    ImageValidationService,
    UserInputResolverService,
    ImageResolverService,
  ],
  exports: [UserService],
})
export class UserModule {}
