import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from 'src/schema/project.schema';
import { ProjectInputResolverService } from 'src/pipes/resolve-project.pipe';
import { ImageValidationService } from 'src/common/image/image-validation.service';
import { ImageResolverService } from 'src/common/image/image-resolver.service';
import { CloudinaryProvider } from 'src/common/cloudinary/cloudinary.provider';
import { User, UserSchema } from 'src/schema/user.schema';
import { ComplexFuntionResolverService } from 'src/utils/helper-function';

@Module({
  imports: [
     MongooseModule.forFeature([
          { name: Project.name, schema: ProjectSchema },
          { name: User.name, schema: UserSchema },
        ]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectInputResolverService,
    ComplexFuntionResolverService,
    ImageValidationService,
    ImageResolverService,
    CloudinaryProvider,
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
