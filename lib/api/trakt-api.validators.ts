import { TraktValidationError } from '~/models/trakt-error.model';
import { DateISO8601 } from '~/utils/regex.utils';

export const TraktApiValidators = {
  date: (date: string, regex = DateISO8601) => {
    if (!regex.test(date)) {
      throw new TraktValidationError(`Invalide 'start_date' format, found '${date}', expected '${regex}'`);
    }
    return true;
  },
} as const;
