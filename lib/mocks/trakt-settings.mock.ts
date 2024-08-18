import type { TraktClientSettings } from '~/models/trakt-client.model';

import { Config } from '~/config';

export const traktClientSettingsMock: TraktClientSettings = {
  client_id: 'client_id',
  client_secret: 'client_secret',
  redirect_uri: 'chrome-extension://redirect_uri/views/options/index.html',
  endpoint: Config.Endpoint.Production,

  useragent: 'my-user-agent',
};
