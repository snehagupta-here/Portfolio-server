import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/schema/blog.schema';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CloudinaryProvider } from '../../common/cloudinary/cloudinary.provider';
import { ImageResolverService } from '../../common/image/image-resolver.service';
import { ImageValidationService } from '../../common/image/image-validation.service';
import { BlogInputResolverService } from 'src/pipes/resolve-blog.pipe';
import { User, UserSchema } from 'src/schema/user.schema';
import { ComplexFuntionResolverService } from 'src/utils/helper-function';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BlogController],
  providers: [
    BlogService,
    BlogInputResolverService,
    ImageValidationService,
    ComplexFuntionResolverService,
    ImageResolverService,
    CloudinaryProvider,
  ],
  exports: [BlogService],
})
export class BlogModule {}
