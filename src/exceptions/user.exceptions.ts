import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'User already exists',
      error: 'Bad Request',
    });
  }
}

export class UserEmailAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      message: 'Email already exists',
      error: 'Bad Request',
    });
  }
}

export class UserCredentialsIncompleteException extends BadRequestException {
  constructor() {
    super({
      message: 'Both email and password are required together',
      error: 'Bad Request',
    });
  }
}

export class InvalidUserIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid user ID',
      error: 'Bad Request',
    });
  }
}

export class InvalidUserSkillIdException extends BadRequestException {
  constructor() {
    super({
      message: 'Invalid skill_id',
      error: 'Bad Request',
    });
  }
}

export class UserSkillNotFoundException extends BadRequestException {
  constructor() {
    super({
      message: 'Skill not found',
      error: 'Bad Request',
    });
  }
}

export class UserSearchQueryRequiredException extends BadRequestException {
  constructor() {
    super({
      message: 'Either name or skill_id query parameter is required',
      error: 'Bad Request',
    });
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'User not found',
      error: 'Not Found',
    });
  }
}

export class UserResumeNotFoundException extends NotFoundException {
  constructor() {
    super({
      message: 'User resume not found',
      error: 'Not Found',
    });
  }
}

export class UserResumeDownloadFailedException extends BadGatewayException {
  constructor() {
    super({
      message: 'Failed to download user resume',
      error: 'Bad Gateway',
    });
  }
}
