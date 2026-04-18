import { HttpException, HttpStatus } from '@nestjs/common';

export class DoubleEntryViolationException extends HttpException {
  constructor(message: string = 'The sum of debits and credits must equal exactly 0.') {
    super(
      {
        success: false,
        code: 'ERR_DOUBLE_ENTRY_VIOLATION',
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
