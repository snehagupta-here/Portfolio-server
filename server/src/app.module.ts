import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './modules/user/user.module';
import { SkillModule } from './modules/skill/skill.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';
import { BlogModule } from './modules/blog/blog.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

   MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: 'mongodb+srv://admin:WCoB057CkiXFNhgh@cluster0.h9xpsvl.mongodb.net/',
  }),
}),

    UserModule,
    ProjectModule,
    SkillModule,
    ExperienceModule,
    AchievementModule,
    TestimonialModule,
    BlogModule,
    ContactUsModule,
  ],
})
export class AppModule {}
