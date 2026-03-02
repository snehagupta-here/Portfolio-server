import { Controller, Post, Body } from '@nestjs/common';
import { ContactUsBody } from 'src/dto';
import { ContactUsService } from './contact-us.service';
@Controller('contact-us')
export class ContactUsController {
    constructor(
        private readonly contactUsService : ContactUsService
    ){}
    @Post()
    async contactUs(@Body() body: ContactUsBody){
        return await this.contactUsService.contactUs(body);
    }
}
