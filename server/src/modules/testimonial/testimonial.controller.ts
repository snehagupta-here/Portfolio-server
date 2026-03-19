import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialDto } from 'src/dto';
@Controller('testimonial')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  // ✅ CREATE
  @Post()
  async createTestimonial(
    @Body() body: TestimonialDto,
  ) {
    return await this.testimonialService.addTestimonial(body);
  }

  @Get()
  async getAllTestimonials() {
    return await this.testimonialService.getAllTestimonials();
  }

  @Get(':id')
  async getTestimonialById(@Param('id') id: string) {
    return await this.testimonialService.getTestimonialById(id);
  }

  @Patch(':id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() body: Partial<TestimonialDto>,
  ) {
    return await this.testimonialService.updateTestimonial(id, body);
  }

  @Delete(':id')
  async deleteTestimonial(@Param('id') id: string) {
    return await this.testimonialService.deleteTestimonial(id);
  }
}