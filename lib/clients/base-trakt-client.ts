import { BaseClient, BaseHeaderContentType, injectCorsProxyPrefix, parseUrl } from '@dvcol/base-http-client';

import type { TraktApi } from '~/api/trakt-api.endpoints';

import type { TraktAuthentication, TraktClientAuthentication } from '~/models/trakt-authentication.model';

import type {
  ITraktApi,
  TraktApiParams,
  TraktApiQuery,
  TraktApiResponse,
  TraktApiResponseLimit,
  TraktApiTemplate,
  TraktClientOptions,
  TraktClientSettings,
} from '~/models/trakt-client.model';

import type { Primitive } from '~/utils/typescript.utils';

import { isFilter, TraktApiFilterValidator } from '~/api/trakt-api.filters';
import { TraktExpiredTokenError, TraktFilterError, TraktInvalidParameterError, TraktValidationError } from '~/models';
import { TraktApiHeaders } from '~/models/trakt-client.model';

/**
 * Checks if the fetch response is OK and handles redirects.
 *
 * @private
 *
 * @param  response - The fetch response.
 *
 * @returns  The same response object if OK.
 *
 * @throws Throws the response if not OK.
 */
export const isResponseOk = (response: Response) => {
  if (response.type === 'opaqueredirect') return response;
  if (!response.ok || response.status >= 400) throw response;
  return response;
};

/**
 * Parses a Trakt API authentication response to mutate the {@link TraktClientAuthentication} object.
 * @param response - The response from the Trakt API.
 * @param auth - The current authentication object.
 */
export const parseAuthResponse = <T extends TraktAuthentication>(response: T, auth: TraktClientAuthentication = {}): TraktClientAuthentication => ({
  ...auth,
  refresh_token: response.refresh_token,
  access_token: response.access_token,
  expires: (response.created_at + response.expires_in) * 1000,
});

/**
 * Parses a Trakt API response to extract {@link TraktClientPagination} and other information.
 *
 * @private
 *
 * @template T - The type of the response.
 *
 * @param {Response} response - The fetch response.
 *
 * @returns {TraktApiResponse<T>} The parsed Trakt API response.
 */
export const parseResponse = <T>(response: Response): TraktApiResponse<T> => {
  isResponseOk(response);

  const _response = response as TraktApiResponse<T>;

  if (
    response.headers.has(TraktApiHeaders.XPaginationItemCount) ||
    response.headers.has(TraktApiHeaders.XPaginationPageCount) ||
    response.headers.has(TraktApiHeaders.XPaginationLimit) ||
    response.headers.has(TraktApiHeaders.XPaginationPage)
  ) {
    _response.pagination = {
      itemCount: Number(response.headers.get(TraktApiHeaders.XPaginationItemCount)),
      pageCount: Number(response.headers.get(TraktApiHeaders.XPaginationPageCount)),
      limit: Number(response.headers.get(TraktApiHeaders.XPaginationLimit)),
      page: Number(response.headers.get(TraktApiHeaders.XPaginationPage)),
    };
  }

  if (response.headers.has(TraktApiHeaders.XSortBy) || response.headers.has(TraktApiHeaders.XSortHow)) {
    _response.sort = {
      by: response.headers.get(TraktApiHeaders.XSortBy),
      how: response.headers.get(TraktApiHeaders.XSortHow),
    };
  }

  if (response.headers.has(TraktApiHeaders.XAppliedSortBy) || response.headers.has(TraktApiHeaders.XAppliedSortHow)) {
    _response.appliedSort = {
      by: response.headers.get(TraktApiHeaders.XAppliedSortBy),
      how: response.headers.get(TraktApiHeaders.XAppliedSortHow),
    };
  }

  if (response.headers.has(TraktApiHeaders.XStartDate) || response.headers.has(TraktApiHeaders.XEndDate)) {
    _response.interval = {
      start: response.headers.get(TraktApiHeaders.XStartDate),
      end: response.headers.get(TraktApiHeaders.XEndDate),
    };
  }

  if (
    response.headers.has(TraktApiHeaders.XUpgradeURL) ||
    response.headers.has(TraktApiHeaders.XVipUser) ||
    response.headers.has(TraktApiHeaders.XAccountLimit)
  ) {
    _response.vip = {
      url: response.headers.get(TraktApiHeaders.XUpgradeURL),
      user: response.headers.get(TraktApiHeaders.XVipUser),
      limit: response.headers.get(TraktApiHeaders.XAccountLimit),
    };
  }

  if (response.headers.has(TraktApiHeaders.XRatelimit) || response.headers.has(TraktApiHeaders.RetryAfter)) {
    _response.limit = {};
    if (response.headers.has(TraktApiHeaders.XRatelimit)) {
      try {
        _response.limit.rate = JSON.parse(response.headers.get(TraktApiHeaders.XRatelimit) as string) as TraktApiResponseLimit;
      } catch (error) {
        console.warn('Failed to parse rate limit', response.headers.get(TraktApiHeaders.XRatelimit), error);
      }
    }
    if (response.headers.has(TraktApiHeaders.RetryAfter)) {
      _response.limit.retry = Number(response.headers.get(TraktApiHeaders.RetryAfter));
    }
  }

  return _response;
};

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseTraktClient extends TraktApi {}

/**
 * Represents a Trakt API client with common functionality.
 *
 * @class BaseTraktClient
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class BaseTraktClient extends BaseClient<TraktApiQuery, TraktApiResponse, TraktClientSettings, TraktClientAuthentication> implements TraktApi {
  /**
   * Creates an instance of BaseTraktClient.
   * @param options - The options for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(options: TraktClientOptions, authentication: TraktClientAuthentication = {}, api: ITraktApi = {}) {
    super(options, authentication, api);
  }

  /**
   * Parses the template to construct the headers for a Trakt API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   *
   * @returns {HeadersInit} The parsed request headers.
   *
   * @throws {Error} Throws an error if OAuth is required and the access token is missing.
   */
  protected _parseHeaders<T extends TraktApiParams = TraktApiParams>(template: TraktApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [TraktApiHeaders.UserAgent]: this.settings.useragent,
      [TraktApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [TraktApiHeaders.TraktApiVersion]: '2',
      [TraktApiHeaders.TraktApiKey]: this.settings.client_id,
    };

    if (template.opts?.auth === true && !this.auth.access_token) {
      throw new TraktInvalidParameterError('OAuth required: access_token is missing');
    } else if (template.opts?.auth && this.auth.access_token) {
      if (this.auth.expires !== undefined && this.auth.expires > Date.now()) {
        headers[TraktApiHeaders.Authorization] = `Bearer ${this.auth.access_token}`;
      } else {
        throw new TraktExpiredTokenError('OAuth required: access_token has expired');
      }
    }

    return headers;
  }

  /**
   * Parses the parameters and constructs the URL for a Trakt API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {string} The URL for the Trakt API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parseUrl<T extends TraktApiParams = TraktApiParams>(template: TraktApiTemplate<T>, params: T): URL {
    const _template = injectCorsProxyPrefix(template, this.settings);
    const url = parseUrl<T>(_template, params, this.settings.endpoint);
    const queryParams = url.searchParams;

    // Adds Filters query parameters
    if (_template.opts?.filters?.length && params.filters) {
      Object.entries(params.filters as { [s: string]: Primitive | Primitive[] }).forEach(([key, value]) => {
        if (!isFilter(key) || !_template.opts?.filters?.includes(key)) {
          throw new TraktFilterError(`Filter is not supported: '${key}'`);
        }

        if (!TraktApiFilterValidator.validate(key, value, true)) {
          throw new TraktValidationError(`Filter '${key}' is invalid: '${value}'`);
        }

        queryParams.set(key, `${value}`);
      });
    }

    // Pagination
    if (_template.opts?.pagination && params.pagination) {
      if (params.pagination.page) queryParams.set('page', `${params.pagination.page}`);
      if (params.pagination.limit) queryParams.set('limit', `${params.pagination.limit}`);
    }

    // Extended
    if (_template.opts?.extended?.length && params.extended) {
      const templateExtended = _template.opts.extended;
      const paramsExtended = Array.isArray(params.extended) ? params.extended : [params.extended];
      if (paramsExtended.some(e => !templateExtended.includes(e))) {
        throw new TraktInvalidParameterError(`Invalid value '${params.extended}', extended should be '${_template.opts.extended.join(', ')}'`);
      }
      queryParams.set('extended', `${params.extended}`);
    }

    return url;
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {TraktApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse(response: Response): TraktApiResponse {
    return parseResponse<TraktApiParams>(response);
  }
}
