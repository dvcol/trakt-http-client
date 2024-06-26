import { HttpMethod } from '@dvcol/common-utils/http';

import type { TraktApiParamsPagination } from '~/models/trakt-client.model';

import type { TraktCertification, TraktCountry, TraktGenre, TraktLanguage, TraktNetwork } from '~/models/trakt-entity.model';

import { authentication } from '~/api/endpoints/authentication.endpoint';
import { calendars } from '~/api/endpoints/calendar.endpoint';
import { checkin } from '~/api/endpoints/checkin.endpoint';
import { comments } from '~/api/endpoints/comments.endpoint';
import { episodes } from '~/api/endpoints/episodes.endpoint';
import { lists } from '~/api/endpoints/lists.endpoint';
import { movies } from '~/api/endpoints/movies.endpoint';
import { notes } from '~/api/endpoints/notes.endpoint';
import { people } from '~/api/endpoints/people.endpoint';
import { recommendations } from '~/api/endpoints/recommendations.endpoint';
import { scrobble } from '~/api/endpoints/scrobble.endpoint';
import { search } from '~/api/endpoints/search.endpoint';
import { seasons } from '~/api/endpoints/seasons.endpoint';
import { shows } from '~/api/endpoints/shows.endpoint';
import { sync } from '~/api/endpoints/sync.endpoint';
import { users } from '~/api/endpoints/users.endpoint';
import { TraktClientEndpoint } from '~/models/trakt-client.model';

export const traktApi = {
  authentication,
  calendars,
  checkin,
  /**
   * Get a list of all certifications, including names, slugs, and descriptions.
   *
   * Most TV shows and movies have a certification to indicate the content rating. Some API methods allow filtering by certification, so it's good to cache this list in your app.
   *
   * Note: Only us certifications are currently returned.
   *
   * @see [get-certifications]{@link https://trakt.docs.apiary.io/#reference/certifications/list/get-certifications}
   */
  certifications: new TraktClientEndpoint<
    {
      /** Certification type : shows or movies */
      type: 'movies' | 'shows';
    },
    TraktCertification[]
  >({
    method: HttpMethod.GET,
    url: '/certifications/:type',
    opts: {
      parameters: {
        path: {
          type: true,
        },
      },
    },
  }),
  comments,
  /**
   * Get a list of all countries, including names and codes.
   *
   * Some API methods allow filtering by country code, so it's good to cache this list in your app.
   *
   * @see [countries]{@link https://trakt.docs.apiary.io/#reference/countries}
   */
  countries: new TraktClientEndpoint<
    {
      /** Certification type : shows or movies */
      type: 'movies' | 'shows';
    },
    TraktCountry[]
  >({
    method: HttpMethod.GET,
    url: '/countries/:type',
    opts: {
      parameters: {
        path: {
          type: true,
        },
      },
    },
  }),
  /**
   * Get a list of all genres, including names and slugs.
   *
   * One or more genres are attached to all movies and shows. Some API methods allow filtering by genre, so it's good to cache this list in your app.
   *
   * @see [genres]{@link https://trakt.docs.apiary.io/#reference/genres}
   */
  genres: new TraktClientEndpoint<
    {
      /** Certification type : shows or movies */
      type: 'movies' | 'shows';
    },
    TraktGenre[]
  >({
    method: HttpMethod.GET,
    url: '/genres/:type',
    opts: {
      parameters: {
        path: {
          type: true,
        },
      },
    },
  }),
  /**
   * Get a list of all langauges, including names and codes.
   *
   * Some API methods allow filtering by language code, so it's good to cache this list in your app.
   *
   * @see [list]{@link https://trakt.docs.apiary.io/#reference/genres/list}
   */
  languages: new TraktClientEndpoint<
    {
      /** Certification type : shows or movies */
      type: 'movies' | 'shows';
    },
    TraktLanguage[]
  >({
    method: HttpMethod.GET,
    url: '/languages/:type',
    opts: {
      parameters: {
        path: {
          type: true,
        },
      },
    },
  }),
  lists,
  movies,
  /**
   * Get a list of all TV networks, including the name, country, and ids.
   *
   * Most TV shows have a TV network where it originally aired. Some API methods allow filtering by network, so it's good to cache this list in your app.
   *
   * @pagination optional - {@link TraktApiPagination}
   *
   * @see [networks]{@link https://trakt.docs.apiary.io/#reference/networks}
   */
  networks: new TraktClientEndpoint<TraktApiParamsPagination, TraktNetwork[]>({
    method: HttpMethod.GET,
    url: '/networks',
    opts: {
      pagination: 'optional',
    },
  }),
  notes,
  people,
  recommendations,
  scrobble,
  search,
  shows,
  seasons,
  episodes,
  sync,
  users,
};

export type TraktApi = typeof traktApi;
