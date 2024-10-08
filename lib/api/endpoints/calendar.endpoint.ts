import { HttpMethod } from '@dvcol/common-utils/http';

import type { TraktCalendarMovie, TraktCalendarQuery, TraktCalendarShow } from '~/models/trakt-calendar.model';
import type { TraktApiTemplate, TraktApiTemplateOptions } from '~/models/trakt-client.model';

import { TraktApiCommonFilterValues } from '~/api/trakt-api.filters';
import { TraktApiExtended, TraktClientEndpoint } from '~/models/trakt-client.model';

import { getDateTransform, getDateValidate } from '~/models/trakt-entity.model';

import { DateISO8601Short } from '~/utils/regex.utils';

const opts: TraktApiTemplateOptions = {
  extended: [TraktApiExtended.Full],
  filters: TraktApiCommonFilterValues,
  parameters: {
    path: {
      start_date: false,
      days: false,
    },
    query: {
      extended: false,
    },
  },
};

const validate: TraktApiTemplate<TraktCalendarQuery>['validate'] = getDateValidate('start_date', DateISO8601Short);
const transform: TraktApiTemplate<TraktCalendarQuery>['transform'] = getDateTransform('start_date', true);

/**
 * By default, the calendar will return all shows or movies for the specified time period and can be global or user specific.
 * The start_date defaults to today and days to 7. The maximum amount of days you can send is 33.
 * All dates (including the start_date and first_aired) are in UTC, so it's up to your app to handle any offsets based on the user's time zone.
 *
 * The my calendar displays episodes for all shows that have been watched, collected, or watchlisted plus individual episodes on the watchlist.
 * It will remove any shows that have been hidden from the calendar. The all calendar displays info for all shows airing during the specified period.
 *
 * @see [calendars]{@link https://trakt.docs.apiary.io/#reference/calendars}
 */
export const calendars = {
  my: {
    shows: {
      /**
       * Returns all shows airing during the time period specified.
       *
       * @auth required
       * @extended true - {@link TraktApiExtended.Full}
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-shows]{@link https://trakt.docs.apiary.io/#reference/calendars/my-shows/get-shows}
       */
      get: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/:start_date/:days',
        opts: { auth: true, ...opts },
        validate,
        transform,
      }),
      /**
       * Returns all new show premieres (series_premiere) airing during the time period specified.
       *
       * @auth required
       * @extended true - {@link TraktApiExtended.Full}
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-new-shows]{@link https://trakt.docs.apiary.io/#reference/calendars/my-new-shows/get-new-shows}
       */
      new: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/new/:start_date/:days',
        opts: { auth: true, ...opts },
        validate,
        transform,
      }),
      /**
       * Returns all show premieres (mid_season_premiere, season_premiere, series_premiere) airing during the time period specified.
       *
       * @auth required
       * @extended true - {@link TraktApiExtended.Full}
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-season-premieres]{@link https://trakt.docs.apiary.io/#reference/calendars/my-season-premieres/get-season-premieres}
       */
      premieres: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/premieres/:start_date/:days',
        opts: { auth: true, ...opts },
        validate,
        transform,
      }),
      /**
       * Returns all show finales (mid_season_finale, season_finale, series_finale) airing during the time period specified.
       *
       * @auth required
       * @extended true - {@link TraktApiExtended.Full}
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-finales]{@link https://trakt.docs.apiary.io/#reference/calendars/my-finales/get-finales}
       */
      finales: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/my/shows/finales/:start_date/:days',
        opts: { auth: true, ...opts },
        validate,
        transform,
      }),
    },
    /**
     * Returns all movies with a release date during the time period specified.
     *
     * @auth required
     * @extended true - {@link TraktApiExtended.Full}
     * @filters common - {@link TraktApiCommonFilters}
     *
     * @see [get-movies]{@link https://trakt.docs.apiary.io/#reference/calendars/my-movies/get-movies}
     */
    movies: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarMovie[]>({
      method: HttpMethod.GET,
      url: '/calendars/my/movies/:start_date/:days',
      opts: { auth: true, ...opts },
      validate,
      transform,
    }),
    /**
     * Returns all movies with a DVD release date during the time period specified.
     *
     * @auth required
     * @extended true - {@link TraktApiExtended.Full}
     * @filters common - {@link TraktApiCommonFilters}
     *
     * @see [get-dvd-releases]{@link https://trakt.docs.apiary.io/#reference/calendars/my-dvd/get-dvd-releases}
     */
    dvd: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarMovie[]>({
      method: HttpMethod.GET,
      url: '/calendars/my/dvd/:start_date/:days',
      opts: { auth: true, ...opts },
      validate,
      transform,
    }),
  },
  all: {
    /**
     * Returns all shows airing during the time period specified.
     *
     * @filters common - {@link TraktApiCommonFilters}
     *
     * @see [get-shows]{@link https://trakt.docs.apiary.io/#reference/calendars/all-shows/get-shows}
     */
    shows: {
      get: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/all/shows/:start_date/:days',
        opts,
        validate,
        transform,
      }),
      /**
       * Returns all new show premieres (series_premiere) airing during the time period specified.
       *
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-new-shows]{@link https://trakt.docs.apiary.io/#reference/calendars/all-new-shows/get-new-shows}
       */
      new: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/all/shows/new/:start_date/:days',
        opts,
        validate,
        transform,
      }),
      /**
       * Returns all show premieres (mid_season_premiere, season_premiere, series_premiere) airing during the time period specified.
       *
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-season-premieres]{@link https://trakt.docs.apiary.io/#reference/calendars/all-season-premieres/get-season-premieres}
       */
      premieres: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/all/shows/premieres/:start_date/:days',
        opts,
        validate,
        transform,
      }),
      /**
       * Returns all show finales (mid_season_finale, season_finale, series_finale) airing during the time period specified.
       *
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-finales]{@link https://trakt.docs.apiary.io/#reference/calendars/all-finales/get-finales}
       */
      finales: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarShow[]>({
        method: HttpMethod.GET,
        url: '/calendars/all/finales/:start_date/:days',
        opts,
        validate,
        transform,
      }),
      /**
       * Returns all movies with a release date during the time period specified.
       *
       * @filters common - {@link TraktApiCommonFilters}
       *
       * @see [get-movies]{@link https://trakt.docs.apiary.io/#reference/calendars/all-movies/get-movies}
       */
      movies: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarMovie[]>({
        method: HttpMethod.GET,
        url: '/calendars/all/movies/:start_date/:days',
        opts,
        validate,
        transform,
      }),
    },
    /**
     * Returns all movies with a DVD release date during the time period specified.
     *
     * @filters common - {@link TraktApiCommonFilters}
     *
     * @see [get-dvd-releases]{@link https://trakt.docs.apiary.io/#reference/calendars/all-dvd/get-dvd-releases}
     */
    dvd: new TraktClientEndpoint<TraktCalendarQuery, TraktCalendarMovie[]>({
      method: HttpMethod.GET,
      url: '/calendars/all/dvd/:start_date/:days',
      opts,
      validate,
      transform,
    }),
  },
};
