import type { TraktApiExtended, TraktApiParamsExtended, TraktApiParamsPagination } from '~/models/trakt-client.model';
import type { Any, EntityTypes } from '~/models/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktSeason } from '~/models/trakt-season.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { BaseSyncRequestItem } from '~/models/trakt-sync.model';

export const TraktRatingType = {
  Movies: 'movies',
  Shows: 'shows',
  Seasons: 'seasons',
  Episodes: 'episodes',
} as const;

export type TraktRatingTypes = (typeof TraktRatingType)[keyof typeof TraktRatingType];

export type TraktSyncRatingValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type TraktSyncRatingRequest = TraktApiParamsPagination &
  TraktApiParamsExtended<typeof TraktApiExtended.Full> & {
    type?: TraktRatingTypes | 'all';
    /** Filter for a specific rating. */
    rating?: TraktSyncRatingValue;
  };

type BaseTraktRatingItem<E extends EntityTypes = Any> = {
  movie: TraktMovie<E>;
  show: TraktShow<E>;
  season: TraktSeason<E>;
  episode: TraktEpisode<E>;
};

type TraktRatingItem<T extends 'movie' | 'show' | 'season' | 'episode' | Any = Any, E extends EntityTypes = Any> = {
  type: T extends Any ? 'movie' | 'show' | 'season' | 'episode' : T;
} & (T extends 'movie'
  ? Pick<BaseTraktRatingItem<E>, 'movie'>
  : T extends 'show'
    ? Pick<BaseTraktRatingItem<E>, 'show'>
    : T extends 'season'
      ? Pick<BaseTraktRatingItem<E>, 'season' | 'show'>
      : T extends 'episode'
        ? Pick<BaseTraktRatingItem<E>, 'episode' | 'show'>
        :
            | Pick<BaseTraktRatingItem<E>, 'movie'>
            | Pick<BaseTraktRatingItem<E>, 'show'>
            | Pick<BaseTraktRatingItem<E>, 'season' | 'show'>
            | Pick<BaseTraktRatingItem<E>, 'episode' | 'show'>);

export type TraktRating<T extends 'movie' | 'show' | 'season' | 'episode' | Any = Any, E extends EntityTypes = Any> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  rated_at: string;
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & TraktRatingItem<T, E>;

export type TraktRatingRequestItem<T extends 'movies' | 'shows' | 'seasons' | 'episodes' | Any = Any> = {
  /**
   * UTC datetime when the item was rated. - Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ)
   */
  rated_at?: string;
  /** Rating between 1 and 10. */
  rating: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
} & BaseSyncRequestItem<T>;

export type TraktRatingRequest = {
  movies?: TraktRatingRequestItem<'movies'>[];
  shows?: TraktRatingRequestItem<'shows'>[];
  seasons?: TraktRatingRequestItem<'seasons'>[];
  episodes?: TraktRatingRequestItem<'episodes'>[];
};

export type TraktRatingAdded = {
  added: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
  };
};

export type TraktRatingRemoved = {
  deleted: {
    movies: number;
    shows: number;
    seasons: number;
    episodes: number;
  };
  not_found: {
    movies: Pick<TraktMovie, 'ids'>[];
    shows: Pick<TraktShow, 'ids'>[];
    seasons: Pick<TraktSeason, 'ids'>[];
    episodes: Pick<TraktEpisode, 'ids'>[];
  };
};
