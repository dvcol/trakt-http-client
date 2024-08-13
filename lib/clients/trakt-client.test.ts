import { BaseHeaderContentType } from '@dvcol/base-http-client';
import { hasOwnProperty } from '@dvcol/base-http-client/utils/test';

import { HttpMethod } from '@dvcol/common-utils/http';
import { CancellableFetch } from '@dvcol/common-utils/http/fetch';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { minimalTraktApi } from '../api/trakt-api-minimal.endpoints';
import { traktApi } from '../api/trakt-api.endpoints';

import { traktClientSettingsMock } from '../mocks/trakt-settings.mock';

import { parseAuthResponse } from './base-trakt-client';
import { TraktClient } from './trakt-client';

import type { CacheStore } from '@dvcol/common-utils';

import type { TraktAuthentication, TraktDeviceAuthentication } from '~/models/trakt-authentication.model';
import type { TraktApiResponse } from '~/models/trakt-client.model';

import { TraktApiHeaders } from '~/models/trakt-client.model';

describe('trakt-client.ts', () => {
  const traktClient = new TraktClient(traktClientSettingsMock, {}, traktApi);
  const fetch = vi.spyOn(CancellableFetch, 'fetch').mockResolvedValue(new Response());

  const payload = {
    headers: {
      [TraktApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [TraktApiHeaders.UserAgent]: traktClientSettingsMock.useragent,
      [TraktApiHeaders.TraktApiKey]: traktClientSettingsMock.client_id,
      [TraktApiHeaders.TraktApiVersion]: '2',
    },
    method: HttpMethod.GET,
  };

  afterEach(async () => {
    await traktClient.importAuthentication({});
    await traktClient.clearCache();

    vi.clearAllMocks();
  });

  describe('traktClient', () => {
    it('should have every endpoint', () => {
      expect.hasAssertions();

      hasOwnProperty(traktApi, traktClient);
    });

    it('should have only minimal endpoint', () => {
      expect.hasAssertions();

      const minimalClient = new TraktClient(traktClientSettingsMock, {});
      hasOwnProperty(minimalTraktApi, minimalClient);
    });

    it('should query certifications method', async () => {
      expect.assertions(1);

      await traktClient.certifications({
        type: 'movies',
      });

      expect(fetch).toHaveBeenCalledWith(new URL('/certifications/movies', traktClientSettingsMock.endpoint).toString(), payload);
    });

    describe('cache', () => {
      it('should not cache calls', async () => {
        expect.assertions(2);

        await traktClient.certifications({ type: 'movies' });
        await traktClient.certifications({ type: 'movies' });
        await traktClient.certifications({ type: 'movies' });

        expect(fetch).toHaveBeenCalledTimes(3);
        expect(fetch).toHaveBeenCalledWith(new URL('/certifications/movies', traktClientSettingsMock.endpoint).toString(), payload);
      });

      it('should cache subsequent calls', async () => {
        expect.assertions(2);

        await traktClient.certifications.cached({ type: 'movies' });
        await traktClient.certifications.cached({ type: 'movies' });
        await traktClient.certifications.cached({ type: 'movies' });

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(new URL('/certifications/movies', traktClientSettingsMock.endpoint).toString(), payload);
      });

      it('should ignore cache if cache cleared', async () => {
        expect.assertions(2);

        await traktClient.certifications.cached({ type: 'movies' });
        await traktClient.certifications.cached({ type: 'movies' });
        await traktClient.clearCache();
        await traktClient.certifications.cached({ type: 'movies' });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL('/certifications/movies', traktClientSettingsMock.endpoint).toString(), payload);
      });

      it('should clear cache after error', async () => {
        expect.assertions(3);

        const error = new Error('Error');
        fetch.mockRejectedValueOnce(error);

        let err: unknown;
        try {
          await traktClient.certifications.cached({ type: 'movies' });
        } catch (e) {
          err = e;
        } finally {
          expect(err).toBe(error);
        }
        await traktClient.certifications.cached({ type: 'movies' });
        await traktClient.certifications.cached({ type: 'movies' });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL('/certifications/movies', traktClientSettingsMock.endpoint).toString(), payload);
      });

      it('should ignore cache if cache expired', async () => {
        expect.assertions(2);

        const cacheStore: CacheStore<TraktApiResponse> = new Map();
        cacheStore.retention = 15;
        const _traktClient = new TraktClient({ ...traktClientSettingsMock, cacheStore }, {}, traktApi);

        await _traktClient.certifications.cached({ type: 'movies' });
        await _traktClient.certifications.cached({ type: 'movies' });

        // Wait for cache to expire
        await new Promise(resolve => {
          setTimeout(resolve, 20);
        });

        await _traktClient.certifications.cached({ type: 'movies' });

        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith(new URL('/certifications/movies', traktClientSettingsMock.endpoint).toString(), payload);
      });
    });

    const deviceAuthentication: TraktDeviceAuthentication = {
      device_code: 'device_code',
      user_code: 'user_code',
      verification_url: 'verification_url',
      expires_in: new Date().getTime() + 10000,
      interval: 0.01,
    };

    it('should get device code', async () => {
      expect.assertions(2);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(deviceAuthentication)));

      await traktClient.getDeviceCode();

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/device/code', traktClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.POST,
        body: JSON.stringify({ client_id: traktClientSettingsMock.client_id }),
      });

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const authentication: TraktAuthentication = {
      access_token: 'access_token',
      refresh_token: 'refresh_token',
      expires_in: new Date().getTime() + 10000,
      created_at: new Date().getTime(),
      token_type: 'token_type',
      scope: 'scope',
    };

    const clientAuthentication = parseAuthResponse(authentication);

    it('should poll with device code', async () => {
      expect.assertions(2);

      fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
        }),
      );
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await traktClient.pollWithDeviceCode(deviceAuthentication);

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/device/token', traktClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.POST,
        body: JSON.stringify({
          client_id: traktClientSettingsMock.client_id,
          client_secret: traktClientSettingsMock.client_secret,
          code: 'device_code',
        }),
      });

      expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('should exit on error while polling with device code', async () => {
      expect.assertions(5);

      fetch.mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 500,
        }),
      );

      let error: Response | undefined;
      try {
        await traktClient.pollWithDeviceCode(deviceAuthentication);
      } catch (err) {
        error = err as Response;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Response);
        expect(error?.status).toBe(500);
        expect(fetch).toHaveBeenCalledWith(new URL('/oauth/device/token', traktClientSettingsMock.endpoint).toString(), {
          ...payload,
          method: HttpMethod.POST,
          body: JSON.stringify({
            client_id: traktClientSettingsMock.client_id,
            client_secret: traktClientSettingsMock.client_secret,
            code: 'device_code',
          }),
        });

        expect(fetch).toHaveBeenCalledTimes(1);
      }
    });

    it('should redirect to authorization url', async () => {
      expect.assertions(1);

      const state = '0e44c45dd73fb296';

      const url = new URL('/oauth/authorize', traktClientSettingsMock.endpoint);
      url.searchParams.append('response_type', 'code');
      url.searchParams.append('client_id', traktClientSettingsMock.client_id);
      url.searchParams.append('redirect_uri', traktClientSettingsMock.redirect_uri);
      url.searchParams.append('state', state);

      await traktClient.redirectToAuthentication({ state });

      expect(fetch).toHaveBeenCalledWith(url.toString(), {
        credentials: 'omit',
        headers: {
          [TraktApiHeaders.ContentType]: BaseHeaderContentType.Json,
          [TraktApiHeaders.UserAgent]: traktClientSettingsMock.useragent,
          [TraktApiHeaders.TraktApiKey]: traktClientSettingsMock.client_id,
          [TraktApiHeaders.TraktApiVersion]: '2',
        },
        method: HttpMethod.GET,
        redirect: 'manual',
      });
    });

    it('should exchange code for token', async () => {
      expect.assertions(1);

      const redirect_code = 'redirect_code';

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await traktClient.exchangeCodeForToken(redirect_code);

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/token', traktClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.POST,
        body: JSON.stringify({
          client_id: traktClientSettingsMock.client_id,
          client_secret: traktClientSettingsMock.client_secret,
          redirect_uri: traktClientSettingsMock.redirect_uri,
          grant_type: 'authorization_code',
          code: redirect_code,
        }),
      });
    });

    it('should throw error while exchanging code with invalid CSRF', async () => {
      expect.assertions(3);

      const state = '0e44c45dd73fb296';

      await traktClient.redirectToAuthentication({ state });

      let error: Error | undefined;
      try {
        await traktClient.exchangeCodeForToken('redirect_code', 'invalid_state');
      } catch (err) {
        error = err as Error;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('Invalid CSRF (State)');
      }
    });

    it('should refreshing with existing token', async () => {
      expect.assertions(1);

      await traktClient.importAuthentication(clientAuthentication);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await traktClient.refreshToken();

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/token', traktClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.POST,
        body: JSON.stringify({
          client_id: traktClientSettingsMock.client_id,
          client_secret: traktClientSettingsMock.client_secret,
          redirect_uri: traktClientSettingsMock.redirect_uri,
          grant_type: 'refresh_token',
          refresh_token: authentication.refresh_token,
        }),
      });
    });

    it('should refresh token when importing an expired auth', async () => {
      expect.assertions(1);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await traktClient.importAuthentication({ ...clientAuthentication, expires: new Date().getTime() - 10000 });

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/token', traktClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.POST,
        body: JSON.stringify({
          client_id: traktClientSettingsMock.client_id,
          client_secret: traktClientSettingsMock.client_secret,
          redirect_uri: traktClientSettingsMock.redirect_uri,
          grant_type: 'refresh_token',
          refresh_token: authentication.refresh_token,
        }),
      });
    });

    it('should throw error while refreshing without existing token', async () => {
      expect.assertions(3);

      let error: Error | undefined;
      try {
        await traktClient.refreshToken();
      } catch (err) {
        error = err as Error;
      } finally {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('No refresh token found.');
      }
    });

    it('should not revoke token if already expired', async () => {
      expect.assertions(1);

      await traktClient.importAuthentication({ ...clientAuthentication, expires: undefined });

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await traktClient.revokeAuthentication();

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should revoke token', async () => {
      expect.assertions(1);

      await traktClient.importAuthentication(clientAuthentication);

      fetch.mockResolvedValueOnce(new Response(JSON.stringify(authentication)));

      await traktClient.revokeAuthentication();

      expect(fetch).toHaveBeenCalledWith(new URL('/oauth/revoke', traktClientSettingsMock.endpoint).toString(), {
        ...payload,
        method: HttpMethod.POST,
        body: JSON.stringify({
          token: authentication.access_token,
          client_id: traktClientSettingsMock.client_id,
          client_secret: traktClientSettingsMock.client_secret,
        }),
      });
    });
  });
});
