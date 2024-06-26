import type { TraktApiExtended, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt-client.model';
import type { Any } from '~/models/trakt-entity.model';
import type { TraktList, TraktListItem } from '~/models/trakt-list.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { BaseSyncRequestItem } from '~/models/trakt-sync.model';

export type TraktFavoriteList = TraktList<'favorites'>;

export type TraktFavoriteItem<T extends 'movie' | 'show' | Any = Any> = T extends 'movie'
  ? TraktListItem<'movie'>
  : T extends 'show'
    ? TraktListItem<'show'>
    : TraktListItem<'movie'> | TraktListItem<'show'>;

export type TraktFavoriteRequest = {
  movies?: BaseSyncRequestItem<'movies'>[];
  shows?: BaseSyncRequestItem<'shows'>[];
};

export type TraktFavoriteAdded = {
  added: {
    movies: number;
    shows: number;
  };
  existing: {
    movies: number;
    shows: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
  };
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktFavoriteRemoved = {
  deleted: {
    movies: number;
    shows: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
  };
  list: {
    /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
    updated_at: string;
    item_count: number;
  };
};

export type TraktFavoriteGetQuery = {
  /* Filter for a specific item type */
  type?: 'movies' | 'shows';
  /** How to sort (only if type is also sent) */
  sort?: 'rank' | 'added' | 'released' | 'title';
} & TraktApiParamsExtended<typeof TraktApiExtended.Full> &
  TraktApiParamsPagination;
