export const TraktErrorTypes = {
  TraktValidationError: 'TraktValidationError',
  TraktFilterError: 'TraktFilterError',
  TraktUnauthorizedError: 'TraktUnauthorizedError',
  TraktRateLimitError: 'TraktRateLimitError',
  TraktInvalidParameterError: 'TraktInvalidParameterError',
  TraktPollingExpiredError: 'TraktPollingExpiredError',
  TraktExpiredTokenError: 'TraktExpiredTokenError',
  TraktInvalidCsrfError: 'TraktInvalidCsrfError',
};

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

export class TraktUnauthorizedError extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | Response;

  constructor(message?: string, error?: Error | Response) {
    super(message);
    this.name = TraktErrorTypes.TraktUnauthorizedError;
    this.error = error;
  }
}

export class TraktRateLimitError extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | Response;

  constructor(message?: string, error?: Error | Response) {
    super(message);
    this.name = TraktErrorTypes.TraktRateLimitError;
    this.error = error;
  }
}

export class TraktInvalidParameterError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktInvalidParameterError;
  }
}

export class TraktPollingExpiredError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktPollingExpiredError;
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
