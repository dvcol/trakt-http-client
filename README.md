<h1 align="center">@dvcol/trakt-http-client</h1>
<p>
  <img src="https://img.shields.io/badge/pnpm-%3E%3D9.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
  <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
  </a>
</p>

> Simple fetch based http client for trakt.tv API with full typescript support (request and response).

## Prerequisites

- pnpm >=9.0.0
- node >=20.0.0

## Install

```sh
pnpm install
```

## Usage

```sh
pnpm add @dvcol/trakt-http-client
```

### Modular endpoint bundling

Trakt-http-client is designed to be modular and flexible. Although it uses static classes, endpoints are instantiated at runtime and can be easily omitted, extended or overridden.
If your bundler does not support tree-shaking, you can omit unused endpoints by only importing the ones you need.

By default we provide a [full api](https://github.com/dvcol/trakt-http-client/blob/main/lib/api/trakt-api.endpoints.ts#L25) object with all supported endpoints, as well as a [minimal api](https://github.com/dvcol/trakt-http-client/blob/main/lib/api/trakt-api-minimal.endpoints.ts) object with only the essential authentication endpoints.
You can also import any [endpoint by common scope](https://github.com/dvcol/trakt-http-client/tree/main/lib/api/endpoints).

```ts

import { TraktClient } from '@dvcol/trakt-http-client';
import { calendars } from '@dvcol/trakt-http-client/api/calendar';
import { episodes } from '@dvcol/trakt-http-client/api/episodes';
import { minimalTraktApi } from '@dvcol/trakt-http-client/api/minimal';
 
import { Config } from '@dvcol/trakt-http-client/config';

import type { TraktClientSettings } from '@dvcol/trakt-http-client/models';


const traktUsedApi = {
  ...minimalTraktApi,
  calendars,
  episodes,
};

const traktClientSettings: TraktClientSettings = {
  client_id: '<Your trakt ID>',
  client_secret: '<Your trakt secret>',
  redirect_uri: '<Your trakt redirect uri>',
  endpoint: Config.endpoint.Production,

  useragent: '<Your user Agent>',
  corsProxy: '<Optional cors Proxy>',
  corsPrefix: '<Optional cors Proxy prefix>',
};

const initAuthentication = {}


const traktClient = new TraktClient(traktClientSettings, initAuthentication, traktUsedApi);
```

### Features

* [Built-in cache support](https://github.com/dvcol/trakt-http-client/blob/8d9e2fc00154eb50428393cea06b6b69c45282c3/lib/clients/trakt-client.test.ts#L69-L145) (per client, endpoint, or query)
* [Extensible cache store](https://github.com/dvcol/trakt-http-client/blob/8d9e2fc00154eb50428393cea06b6b69c45282c3/lib/clients/trakt-client.test.ts#L125-L144) (in-memory, local storage, etc.)
* [Event observer](https://github.com/dvcol/base-http-client/blob/ed17c369f3cdf93656568373fc2dba841050e427/lib/client/base-client.test.ts#L486-L575) (request, query, auth)
* [Built-in cancellation support](https://github.com/dvcol/base-http-client/blob/ed17c369f3cdf93656568373fc2dba841050e427/lib/client/base-client.test.ts#L691-L758)
* [Code polling authentication](https://github.com/dvcol/trakt-http-client/blob/8d9e2fc00154eb50428393cea06b6b69c45282c3/lib/clients/trakt-client.test.ts#L147-L237)
* [Code redirect authentication](https://github.com/dvcol/trakt-http-client/blob/8d9e2fc00154eb50428393cea06b6b69c45282c3/lib/clients/trakt-client.test.ts#L239-L285)
* [Token refresh](https://github.com/dvcol/trakt-http-client/blob/8d9e2fc00154eb50428393cea06b6b69c45282c3/lib/clients/trakt-client.test.ts#L306-L361)

### Documentation

See [Trakt API documentation](https://trakt.docs.apiary.io/) for more information.

## Author

* Github: [@dvcol](https://github.com/dvcol)

## 📝 License

This project is [MIT](https://github.com/dvcol/trakt-extension/blob/master/LICENSE) licensed.
