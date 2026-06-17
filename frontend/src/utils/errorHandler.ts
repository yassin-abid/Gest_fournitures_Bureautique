/**
 * API Error Handling Utilities
 */

import type { ApiError } from '@/types/common';

export class ApiException extends Error {
  constructor(
    public code: string,
    public message: string,
    public status?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    return {
      code: data.code || `ERROR_${status}`,
      message: data.message || getDefaultErrorMessage(status),
      details: data.details,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      code: 'NETWORK_ERROR',
      message: 'No response from server. Please check your connection.',
    };
  } else {
    // Error in request setup
    return {
      code: 'REQUEST_ERROR',
      message: error.message || 'An unexpected error occurred',
    };
  }
};

export const getDefaultErrorMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Unauthorized. Please log in again.',
    403: 'Forbidden. You do not have permission to access this resource.',
    404: 'Resource not found.',
    409: 'Conflict. This resource already exists or has been modified.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  return messages[status] || 'An unexpected error occurred';
};

export const isRetryableError = (error: ApiError): boolean => {
  const retryableCodes = ['NETWORK_ERROR', 'ERROR_429', 'ERROR_502', 'ERROR_503'];
  return retryableCodes.includes(error.code);
};
