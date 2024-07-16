export const Config = {
  endpoint: {
    /** Production endpoint */
    Production: 'https://api.trakt.tv',
    /** Staging endpoint */
    Staging: 'https://api-staging.trakt.tv',
  },
  verification: {
    url: 'https://trakt.tv/activate',
    code: (code: string) => `https://trakt.tv/activate/${code}`,
  },
};
