import type { TraktClientSettings } from '~/models/trakt-client.model';

export const traktClientSettingsMock: TraktClientSettings = {
  client_id: 'client_id',
  client_secret: 'client_secret',
  redirect_uri: 'chrome-extension://redirect_uri/views/options/index.html',
  endpoint: 'https://api.trakt.tv',

  useragent: 'my-user-agent',
};
