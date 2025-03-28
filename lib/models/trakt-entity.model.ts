import type { RequireAtLeastOne } from '@dvcol/common-utils/common/models';
import type { TraktApiParams, TraktApiTemplate } from '~/models/trakt-client.model';
import type { TraktApiIds } from '~/models/trakt-id.model';

import { TraktApiTransforms } from '~/api/trakt-api.transforms';
import { TraktApiValidators } from '~/api/trakt-api.validators';

export type TraktSharing = RequireAtLeastOne<{
  twitter: boolean;
  mastodon: boolean;
  tumblr: boolean;
}>;

type TraktBaseSlugEntity = {
  name: string;
  slug: string;
};

export type TraktGenre = TraktBaseSlugEntity;
export type TraktCertification = TraktBaseSlugEntity & {
  description: string;
};

type TraktBaseCodeEntity = {
  name: string;
  code: string;
};

export type TraktCountry = TraktBaseCodeEntity;
export type TraktLanguage = TraktBaseCodeEntity;

export type TraktNetwork = {
  name: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  ids: Pick<TraktApiIds, 'trakt' | 'tmdb'>;
};

export type TraktAlias = {
  title: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
};

export type TraktTranslation = {
  title: string;
  overview: string;
  tagline: string;
  /** 2 character language code (ISO 639-1) */
  language: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
};

export type TraktGenericRating = {
  rating: number;
  votes: number;
  distribution?: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, number>;
};

export type TraktExtendedRatings = {
  trakt: TraktGenericRating;
  tmdb?: TraktGenericRating;
  imdb?: TraktGenericRating;
  metascore?: TraktGenericRating;
  rotten_tomatoes?: TraktGenericRating;
  [key: string]: TraktGenericRating;
};

export type TraktRatings<T extends EntityTypes = Any> = T extends Short
  ? TraktGenericRating
  : T extends Extended
    ? TraktExtendedRatings
    : TraktGenericRating | TraktExtendedRatings;

export const toExtendedRatings = (ratings: TraktRatings): TraktExtendedRatings => {
  if ('trakt' in ratings) return ratings;
  return { trakt: ratings };
};

export type TraktStudio = {
  name: string;
  /** 2 character country code (ISO 3166-1 alpha-2) */
  country: string;
  ids: Pick<TraktApiIds, 'trakt' | 'slug' | 'tmdb'>;
};

export type StartDateParam = {
  /**
   * Updated since this date and time.
   * Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   *
   * * <b>Important</b>
   *
   * The start_date is only accurate to the hour, for caching purposes. Please drop the minutes and seconds from your timestamp to help optimize our cached data.
   * For example, use 2021-07-17T12:00:00Z and not 2021-07-17T12:23:34Z.
   */
  start_date?: string | number | Date;
};

export const EntityType = {
  Short: 'short',
  Extended: 'extended',
  Any: 'any',
} as const;

export type Any = typeof EntityType.Any;
export type Short = typeof EntityType.Short;
export type Extended = typeof EntityType.Extended;

export type EntityTypes = (typeof EntityType)[keyof typeof EntityType];

export const getDateValidate = <T extends TraktApiParams>(prop: keyof T, regex?: RegExp): TraktApiTemplate<T>['validate'] => {
  return param => {
    const _date = param[prop];
    if (_date === undefined) return true;
    if (typeof _date === 'string') return TraktApiValidators.date(_date, regex);
    return true;
  };
};

export const getDateTransform = <T extends TraktApiParams>(prop: keyof T, short?: boolean): TraktApiTemplate<T>['transform'] => {
  return param => {
    let _date = param[prop] as string | number | Date;
    if (_date === undefined) return param;
    if (typeof _date !== 'string') _date = _date instanceof Date ? _date.toISOString() : new Date(_date).toISOString();
    if (short && _date.includes('T')) _date = _date.split('T').at(0)!;
    return { ...param, [prop]: TraktApiTransforms.date.dropMinutes(_date) };
  };
};

export const validateStartDate: TraktApiTemplate<StartDateParam>['validate'] = getDateValidate('start_date');
export const transformStartDate: TraktApiTemplate<StartDateParam>['transform'] = getDateTransform('start_date', true);
