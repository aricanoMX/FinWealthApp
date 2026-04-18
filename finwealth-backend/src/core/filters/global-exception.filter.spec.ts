import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('should format HttpException correctly', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({
      status: mockStatus,
    });
    
    const mockHttpArgumentsHost = jest.fn().mockReturnValue({
      getResponse: mockGetResponse,
      getRequest: jest.fn(),
    });

    const mockArgumentsHost = {
      switchToHttp: mockHttpArgumentsHost,
    } as unknown as ArgumentsHost;

    const exception = new HttpException('Resource not found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      code: 'HTTP_EXCEPTION',
      message: 'Resource not found',
    });
  });

  it('should format a generic Error as internal server error', () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({
      status: mockStatus,
    });
    
    const mockHttpArgumentsHost = jest.fn().mockReturnValue({
      getResponse: mockGetResponse,
      getRequest: jest.fn(),
    });

    const mockArgumentsHost = {
      switchToHttp: mockHttpArgumentsHost,
    } as unknown as ArgumentsHost;

    const exception = new Error('Unexpected catastrophic failure');

    filter.catch(exception, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected catastrophic failure',
    }));
  });
});
