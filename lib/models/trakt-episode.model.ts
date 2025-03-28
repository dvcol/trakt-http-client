import type { Any, EntityTypes, Extended, Short } from '~/models/trakt-entity.model';
import type { TraktApiIds } from '~/models/trakt-id.model';
import type { TraktImage } from '~/models/trakt-image.model';
import type { TraktCast } from '~/models/trakt-people.model';

export const TraktEpisodeType = {
  Standard: 'standard',
  SeriesPremiere: 'series_premiere',
  SeasonPremiere: 'season_premiere',
  MidSeasonPremiere: 'mid_season_premiere',
  MidSeasonFinale: 'mid_season_finale',
  SeasonFinale: 'season_finale',
  SeriesFinale: 'series_finale',
};

export type TraktEpisodeTypes = (typeof TraktEpisodeType)[keyof typeof TraktEpisodeType];
export const TraktEpisodeTypeValues = Object.values(TraktEpisodeType);

export type TraktEpisodeShort = {
  season: number;
  number: number;
  title: string;
  ids: Pick<TraktApiIds, 'trakt' | 'tvdb' | 'imdb' | 'tmdb'>;
};

export type TraktEpisodeExtended = TraktEpisodeShort & {
  number_abs: number;
  overview: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  first_aired: string;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  rating: number;
  votes: number;
  comment_count: number;
  /** Array of 2 character language code. (ISO 639-1) */
  available_translations: string[];
  /** In minutes */
  runtime: number;
  episode_type: TraktEpisodeTypes;
  images: TraktImage;
};

export type TraktEpisode<T extends EntityTypes = Short> = T extends Extended
  ? TraktEpisodeExtended
  : T extends Short
    ? TraktEpisodeShort
    : TraktEpisodeShort & Partial<TraktEpisodeExtended>;

export type TraktEpisodeCast = TraktCast<Any, Short, Any>;

export type TraktEpisodeStats = {
  watchers: number;
  plays: number;
  collectors: number;
  collected_episodes: number;
  comments: number;
  lists: number;
  votes: number;
};
