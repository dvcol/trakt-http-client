import type { Any, EntityTypes, Extended, Short } from '~/models/trakt-entity.model';
import type { TraktEpisode } from '~/models/trakt-episode.model';
import type { TraktApiIds } from '~/models/trakt-id.model';
import type { TraktImage } from '~/models/trakt-image.model';
import type { TraktCast } from '~/models/trakt-people.model';

export type TraktSeasonShort = {
  number: number;
  ids: Pick<TraktApiIds, 'trakt' | 'tvdb' | 'tmdb'>;
};

export type TraktSeasonExtended = TraktSeasonShort & {
  rating: number;
  votes: number;
  episode_count: number;
  aired_episodes: number;
  title: string;
  overview: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  first_aired: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  network: string;
  images: TraktImage;
};

export type TraktSeasonEpisodes<T extends EntityTypes = Short> = TraktSeasonShort & {
  episodes: TraktEpisode<T>[];
};

export type TraktSeasonEpisodesExtended = TraktSeasonExtended & TraktSeasonEpisodes<Extended>;

export type TraktSeason<T extends 'episodes' | EntityTypes = Short> = T extends Extended
  ? TraktSeasonExtended
  : T extends 'episodes'
    ? TraktSeasonEpisodes
    : T extends Short
      ? TraktSeasonShort
      : (Partial<TraktSeasonExtended> & Partial<TraktSeasonEpisodes>) & TraktSeasonShort;

export type TraktSeasonCast = TraktCast<Any, 'episodes', Any>;

export type TraktSeasonStats = {
  watchers: number;
  plays: number;
  collectors: number;
  collected_episodes: number;
  comments: number;
  lists: number;
  votes: number;
};
