export const TraktErrorTypes = {
  TraktValidationError: 'TraktValidationError',
  TraktFilterError: 'TraktFilterError',
  TraktUnauthorizedError: 'TraktUnauthorizedError',
  TraktRateLimitError: 'TraktRateLimitError',
  TraktInvalidParameterError: 'TraktInvalidParameterError',
  TraktPollingExpiredError: 'TraktPollingExpiredError',
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
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktUnauthorizedError;
  }
}

export class TraktRateLimitError extends Error {
  constructor(message?: string) {
    super(message);
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
  constructor(message?: string) {
    super(message);
    this.name = TraktErrorTypes.TraktPollingExpiredError;
  }
}
