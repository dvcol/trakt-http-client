import type { Any, EntityTypes, Extended, Short } from '~/models/trakt-entity.model';
import type { TraktApiIds } from '~/models/trakt-id.model';
import type { TraktImage } from '~/models/trakt-image.model';

export type BaseTraktPerson = {
  name: string;
  ids: TraktApiIds;
};

export const TraktPersonJob = {
  Production: 'production',
  Art: 'art',
  Crew: 'crew',
  CostumeAndMakeUp: 'costume & make-up',
  Directing: 'directing',
  Writing: 'writing',
  Sound: 'sound',
  Camera: 'camera',
  VisualEffects: 'visual effects',
  Lighting: 'lighting',
  Editing: 'editing',
} as const;

export type TraktPersonJobs = (typeof TraktPersonJob)[keyof typeof TraktPersonJob];

export type TraktPersonExtended = BaseTraktPerson & {
  social_ids: {
    twitter: string;
    facebook: string;
    instagram: string;
    wikipedia: string;
  };
  biography: string;
  /** Calendar Date in ISO 8601 format (YYYY-MM-DD) */
  birthday: string;
  death: string;
  birthplace: string;
  homepage: string;
  gender: 'male' | 'female' | 'non_binary';
  known_for_department: TraktPersonJobs;
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  images: TraktImage;
};

export type TraktPerson<P extends EntityTypes = Short> = P extends Short
  ? BaseTraktPerson
  : P extends Extended
    ? TraktPersonExtended
    : BaseTraktPerson & Partial<TraktPersonExtended>;

type BaseTraktCastMember<P extends EntityTypes = Short> = {
  characters: string[];
  person: TraktPerson<P>;
};

export type TraktCastMember<T extends 'episodes' | Any | Short = Any, P extends EntityTypes = Short> = T extends 'episodes'
  ? BaseTraktCastMember<P> & { episode_count: number; series_regular?: boolean }
  : T extends Short
    ? BaseTraktCastMember<P>
    : BaseTraktCastMember<P> & { episode_count?: number; series_regular?: boolean };

type BaseTraktCrewMember<P extends EntityTypes = Short> = {
  jobs: string[];
  person: TraktPerson<P>;
};

export type TraktCrewMember<T extends 'episodes' | Any | Short = Any, P extends EntityTypes = Short> = T extends 'episodes'
  ? BaseTraktCrewMember<P> & { episode_count: number }
  : T extends Short
    ? BaseTraktCrewMember<P>
    : BaseTraktCrewMember<P> & { episode_count?: number };

export type TraktCrew<T extends 'episodes' | Any | Short = Any, P extends EntityTypes = Short> = Partial<
  Record<TraktPersonJobs | 'created-by', TraktCrewMember<T, P>[]>
>;

type BaseTraktCast<T extends 'episodes' | Any | Short = Any, P extends EntityTypes = Short> = {
  cast: TraktCastMember<T, P>[];
  crew: TraktCrew<T, P>;
};

type TraktCastExtended<T extends 'episodes' | Any | Short = Any, P extends EntityTypes = Short> = BaseTraktCast<T, P> & {
  guest_stars: TraktCastMember<T, P>[];
};

export type TraktCast<
  T extends 'guest_stars' | Short | Any = Short,
  E extends 'episodes' | Any | Short = Any,
  P extends EntityTypes = Short,
> = T extends 'guest_stars'
  ? TraktCastExtended<E, P>
  : T extends Short
    ? BaseTraktCast<E, P>
    : BaseTraktCast<E, P> & Partial<TraktCastExtended<E, P>>;

export type TraktPersonUpdate<P extends EntityTypes = Any> = {
  /** Timestamp in ISO 8601 GMT format (YYYY-MM-DD'T'hh:mm:ss.sssZ) */
  updated_at: string;
  person: TraktPerson<P>;
};
