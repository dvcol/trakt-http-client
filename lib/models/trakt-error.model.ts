import type { TraktApiResponse } from '~/models/trakt-client.model';

import { TraktResponseCodeMessage } from '~/models/trakt-response-code.model';

export const TraktErrorTypes = {
  TraktApiError: 'TraktApiError',
  TraktApiResponseError: 'TraktApiResponseError',
  TraktValidationError: 'TraktValidationError',
  TraktFilterError: 'TraktFilterError',
  TraktUnauthorizedError: 'TraktUnauthorizedError',
  TraktRateLimitError: 'TraktRateLimitError',
  TraktInvalidParameterError: 'TraktInvalidParameterError',
  TraktPollingExpiredError: 'TraktPollingExpiredError',
  TraktPollingCancelledError: 'TraktPollingCancelledError',
  TraktExpiredTokenError: 'TraktExpiredTokenError',
  TraktInvalidCsrfError: 'TraktInvalidCsrfError',
};

export class TraktApiError<T = unknown> extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | TraktApiResponse<T>;

  constructor(message: string, error?: Error | TraktApiResponse<T>) {
    super(message);
    this.name = TraktErrorTypes.TraktApiError;
    this.error = error;
  }
}

export class TraktValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktValidationError;
  }
}

export class TraktFilterError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktFilterError;
  }
}

export class TraktUnauthorizedError<T = unknown> extends TraktApiError<T> {
  constructor(message?: string, error?: Error | TraktApiResponse<T>) {
    super(message, error);
    this.name = TraktErrorTypes.TraktUnauthorizedError;
  }
}

export class TraktRateLimitError<T = unknown> extends TraktApiError<T> {
  constructor(message?: string, error?: Error | TraktApiResponse<T>) {
    super(message, error);
    this.name = TraktErrorTypes.TraktRateLimitError;
  }
}

export class TraktInvalidParameterError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktInvalidParameterError;
  }
}

export class TraktPollingExpiredError extends Error {
  constructor(message: string = 'Polling expired.') {
    super(message);
    this.name = TraktErrorTypes.TraktPollingExpiredError;
  }
}

export class TraktPollingCancelledError extends Error {
  constructor(message: string = 'Polling cancelled.') {
    super(message);
    this.name = TraktErrorTypes.TraktPollingCancelledError;
  }
}

export class TraktExpiredTokenError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktExpiredTokenError;
  }
}

export class TraktInvalidCsrfError extends Error {
  readonly state?: string;
  readonly expected?: string;
  constructor({ state, expected }: { state?: string; expected?: string } = {}) {
    super(`Invalid CSRF (State): expected '${expected}', but received ${state}`);
    this.name = TraktErrorTypes.TraktInvalidCsrfError;
    this.state = state;
    this.expected = expected;
  }
}

export class TraktApiResponseError<T = unknown> extends Error {
  /** Inner response that this error wraps. */
  readonly response: TraktApiResponse<T>;
  constructor(message: string, response: TraktApiResponse<T>) {
    super(message);
    this.name = TraktErrorTypes.TraktApiResponseError;
    this.response = response;
  }
}

export const parseError = <T = unknown>(error: Error | TraktApiResponse<T>): typeof error | TraktApiResponseError<T> => {
  if (error instanceof Response) {
    const message = TraktResponseCodeMessage[error.status] || error.statusText;
    return new TraktApiResponseError(message, error);
  }
  return error;
};
