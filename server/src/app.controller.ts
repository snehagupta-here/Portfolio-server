import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller('contact-us')
export class ContactUsController {
    constructor(
        private readonly appService : AppService
    ){}
    @Get()
    healthCheck(){
        return this.appService.healthCheck();
    }
}
