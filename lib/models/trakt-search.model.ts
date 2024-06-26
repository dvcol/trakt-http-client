import type { TraktApiCommonFilters } from '~/api/trakt-api.filters';
import type { TraktApiExtended, TraktApiParams, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt-client.model';
import type { Any, EntityTypes, Short } from '~/models/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktList } from '~/models/trakt-list.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktPerson } from '~/models/trakt-people.model';
import type { TraktShow } from '~/models/trakt-show.model';

export type TraktSearchField = {
  movie: 'title' | 'overview' | 'aliases' | 'people' | 'translations' | 'tagline';
  show: 'title' | 'overview' | 'aliases' | 'people' | 'translations';
  episode: 'title' | 'overview';
  person: 'name' | 'biography';
  list: 'name' | 'description';
};

export type TraktSearchType = keyof TraktSearchField;

/**
 * Trakt Search request
 * @see search [Trakt API Documentation](https://trakt.docs.apiary.io/#reference/search)
 */
export type TraktSearch<T extends TraktSearchType = TraktSearchType> = TraktApiParams<
  {
    /** Search type */
    type: T | T[];
    /** Search all text based fields. */
    query: string;
    /** Filter search on (a) specific field(s) */
    fields?: TraktSearchField[T] | TraktSearchField[T][];
    /** Escape special characters in the query string. */
    escape?: boolean;
  },
  typeof TraktApiExtended.Full,
  TraktApiCommonFilters,
  true
>;

type BaseTraktSearchResultItem<I extends EntityTypes = Any> = {
  movie: TraktMovie<I>;
  show: TraktShow<I>;
  episode: TraktEpisode<I>;
  person: TraktPerson<I>;
  list: TraktList<I>;
};

/**
 * Search all text fields that a media object contains (i.e. title, overview, etc).
 * Results are ordered by the most relevant score.
 * Specify the type of results by sending a single value or a comma delimited string for multiple types.
 *
 * @see [search]{@link https://trakt.docs.apiary.io/#reference/search}
 */
export type TraktSearchResult<T extends 'movie' | 'show' | 'episode' | 'person' | 'list' | Any = Any, I extends EntityTypes = Short> = {
  score: number;
  type: T extends Any ? 'movie' | 'show' | 'episode' | 'person' | 'list' : T;
} & (T extends 'movie'
  ? Pick<BaseTraktSearchResultItem<I>, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktSearchResultItem<I>, 'show'>
    : T extends 'episode'
      ? Pick<BaseTraktSearchResultItem<I>, 'show' | 'episode'>
      : T extends 'person'
        ? Pick<BaseTraktSearchResultItem<I>, 'person'>
        : T extends 'list'
          ? Pick<BaseTraktSearchResultItem<I>, 'list'>
          : Partial<BaseTraktSearchResultItem<I>>);

export type TraktIdLookupType = 'trakt' | 'imdb' | 'tmdb' | 'tvdb';

export type TraktIdLookup = {
  id_type: TraktIdLookupType;
  id: string;
  type?: TraktSearchType | TraktSearchType[];
} & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
  TraktApiParamsPagination;
