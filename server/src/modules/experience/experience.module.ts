import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Experience, ExperienceSchema } from 'src/schema/experience.schema';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { CloudinaryProvider } from '../../common/cloudinary/cloudinary.provider';
import { ImageResolverService } from '../../common/image/image-resolver.service';
import { ImageValidationService } from '../../common/image/image-validation.service';
import { ExperienceInputResolverService } from 'src/pipes/resolve-experience.pipe';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
     MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ExperienceController],
  providers: [
    CloudinaryProvider,
    ImageValidationService,
    ImageResolverService,
    ExperienceInputResolverService,
    ExperienceService,
  ],
  exports: [ExperienceService],
})
export class ExperienceModule {}
