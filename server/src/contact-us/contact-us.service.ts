import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ContactUsBody } from '../interfaces';
import { ContactUs } from '../schema/contact-us.schema';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name, 'db')
    private readonly contactUsCollection: Model<ContactUs>,
  ) {}

  async contactUs(body: ContactUsBody) {
    try {
      await this.contactUsCollection.create({ ...body });

      return {
        success: true,
        data: {},
        message: 'Thankyou for contacting, our team will reach out to you soon.',
      };
    } catch (e) {
      if (e instanceof Error) {
        throw new InternalServerErrorException(
          'Failed to insert contact us data: ' + e.message,
        );
      }

      throw new InternalServerErrorException('Failed to insert contact us data');
    }
  }
}