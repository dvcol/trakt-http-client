import type { ExclusiveUnion } from '@dvcol/common-utils/common/models';
import type { Any, EntityTypes } from '~/models/trakt-entity.model';
import type { TraktMovie } from '~/models/trakt-movie.model';
import type { TraktShow } from '~/models/trakt-show.model';
import type { TraktUser } from '~/models/trakt-user.model';

type BaseTraktRecommendation = {
  favorited_by: (TraktUser & { notes: string })[];
};

type TraktRecommendationItem<T extends EntityTypes = Any> = {
  movie: TraktMovie<T>;
  show: TraktShow<T>;
};

export type TraktRecommendation<T extends 'movie' | 'show' | Any = Any, I extends EntityTypes = Any> = T extends 'movie'
  ? BaseTraktRecommendation & Pick<TraktRecommendationItem<I>, 'movie'>
  : T extends 'show'
    ? BaseTraktRecommendation & Pick<TraktRecommendationItem<I>, 'show'>
    : BaseTraktRecommendation & ExclusiveUnion<TraktRecommendationItem<I>>;
