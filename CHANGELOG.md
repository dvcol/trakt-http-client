# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.11](https://github.com/dvcol/trakt-http-client/compare/v1.4.10...v1.4.11) (2024-08-25)

### [1.4.10](https://github.com/dvcol/trakt-http-client/compare/v1.4.9...v1.4.10) (2024-08-21)


### Bug Fixes

* **auth:** clear polling only when resolving/rejecting ([4157955](https://github.com/dvcol/trakt-http-client/commit/4157955fe9c702d5010891224be97d4cc8f642ce))

### [1.4.9](https://github.com/dvcol/trakt-http-client/compare/v1.4.8...v1.4.9) (2024-08-21)


### Bug Fixes

* **endpoints:** add missing validators in schemas ([9cb1c97](https://github.com/dvcol/trakt-http-client/commit/9cb1c97bc8cfc1b8e3c7300bd5c57aecefa4056a))

### [1.4.8](https://github.com/dvcol/trakt-http-client/compare/v1.4.7...v1.4.8) (2024-08-18)


### Bug Fixes

* **config:** adding missing links ([623fec1](https://github.com/dvcol/trakt-http-client/commit/623fec171ee337e564cb26df33d06af0c753aa37))

### [1.4.7](https://github.com/dvcol/trakt-http-client/compare/v1.4.6...v1.4.7) (2024-08-17)


### Bug Fixes

* **polling:** improve polling logic & tests ([f39bf83](https://github.com/dvcol/trakt-http-client/commit/f39bf83d5282898a45c375f7d17babf58cf929d4))

### [1.4.6](https://github.com/dvcol/trakt-http-client/compare/v1.4.5...v1.4.6) (2024-08-13)


### Bug Fixes

* **auth:** persist state when generating urls ([e1fb1ee](https://github.com/dvcol/trakt-http-client/commit/e1fb1eea04d1fec783792d094f57c79a6a1346d1))
* **errors:** propagate error response on 401 & 429 ([11cda17](https://github.com/dvcol/trakt-http-client/commit/11cda17330493452ad8f8290adff0c5e998a0315))

### [1.4.5](https://github.com/dvcol/trakt-http-client/compare/v1.4.4...v1.4.5) (2024-07-31)


### Bug Fixes

* **sync:** export rating sync request ([b27fcb0](https://github.com/dvcol/trakt-http-client/commit/b27fcb04bff0bbf2540ceec7d8201545cfa2a81b))

### [1.4.4](https://github.com/dvcol/trakt-http-client/compare/v1.4.3...v1.4.4) (2024-07-20)

### [1.4.3](https://github.com/dvcol/trakt-http-client/compare/v1.4.2...v1.4.3) (2024-07-18)


### Bug Fixes

* **auth:** return trakt auth when polling device ([8ba80db](https://github.com/dvcol/trakt-http-client/commit/8ba80dbc9a8cd9af04369dc58f416f85081c632a))

### [1.4.2](https://github.com/dvcol/trakt-http-client/compare/v1.4.1...v1.4.2) (2024-07-18)


### Bug Fixes

* **error:** adds missing custom errors ([0d4deb1](https://github.com/dvcol/trakt-http-client/commit/0d4deb13d511729f7b1ce0ae419839f684dfd563))

### [1.4.1](https://github.com/dvcol/trakt-http-client/compare/v1.4.0...v1.4.1) (2024-07-18)


### Bug Fixes

* **checkin:** fix watching query type signature ([f583c66](https://github.com/dvcol/trakt-http-client/commit/f583c66f488ee68981aa788b30aea662b1bc0030))

## [1.4.0](https://github.com/dvcol/trakt-http-client/compare/v1.3.6...v1.4.0) (2024-07-16)


### Features

* **auth:** improve device polling & error managment ([f801e5a](https://github.com/dvcol/trakt-http-client/commit/f801e5a175546c356bddd42e5ed75eabdbdab8ff))

### [1.3.6](https://github.com/dvcol/trakt-http-client/compare/v1.3.5...v1.3.6) (2024-06-23)

### [1.3.5](https://github.com/dvcol/trakt-http-client/compare/v1.3.4...v1.3.5) (2024-06-13)


### Bug Fixes

* **build:** exclude spec files from published dist ([a02499e](https://github.com/dvcol/trakt-http-client/commit/a02499e13bf698824fe89f07b6cc221c437a3db0))

### [1.3.4](https://github.com/dvcol/trakt-http-client/compare/v1.3.3...v1.3.4) (2024-06-13)


### Bug Fixes

* **deps:** move to common package ([58e8b4a](https://github.com/dvcol/trakt-http-client/commit/58e8b4a26b96270a86f894c3a0e9cea2d28f1a5f))

### [1.3.3](https://github.com/dvcol/trakt-http-client/compare/v1.3.2...v1.3.3) (2024-06-12)


### Bug Fixes

* **cache:** fix chaining issues when cancelling fetch ([125f339](https://github.com/dvcol/trakt-http-client/commit/125f339f6e8614535c4f39cd6b88ece1ad0ccde2))

### [1.3.2](https://github.com/dvcol/trakt-http-client/compare/v1.3.1...v1.3.2) (2024-06-12)


### Bug Fixes

* **deps:** bump base-http-client tu support cancellable cached call ([add3e19](https://github.com/dvcol/trakt-http-client/commit/add3e19a590cf28782b1c5dbadd5525ff81b65f9))

### [1.3.1](https://github.com/dvcol/trakt-http-client/compare/v1.3.0...v1.3.1) (2024-06-12)


### Bug Fixes

* **ci:** fix release & bumps base-http version ([b2f1543](https://github.com/dvcol/trakt-http-client/commit/b2f1543367ef00d1781f1bdbe15cd33aa3dc3be6))

## [1.3.0](https://github.com/dvcol/trakt-http-client/compare/v1.2.0...v1.3.0) (2024-05-27)


### Features

* **response:** parse rate limit payload when possible ([3fe0a20](https://github.com/dvcol/trakt-http-client/commit/3fe0a20fcd5b8487c94ad2d07759aeb8a20ad6cc))


### Bug Fixes

* **auth:** adds expiration check and fix parsed response ([11985e2](https://github.com/dvcol/trakt-http-client/commit/11985e2060291fe0c57c785079bf1af3cc9eaef5))
* **tests:** fix refresh and revoke UT ([a0049ed](https://github.com/dvcol/trakt-http-client/commit/a0049ed1e2111b9bd60982871690fbc4b6c7cd4e))

## [1.2.0](https://github.com/dvcol/trakt-http-client/compare/v1.1.0...v1.2.0) (2024-05-12)


### Features

* **config:** adds endpoints in configs ([15acc14](https://github.com/dvcol/trakt-http-client/commit/15acc14534e989cdc41f39431e8ad13b0cdd21ff))

## 1.1.0 (2024-05-12)


### Features

* initial commit ([2d87c9d](https://github.com/dvcol/trakt-http-client/commit/2d87c9d67241d63f62fa19a902c83cce688154d4))
