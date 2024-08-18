export const Config = {
  Endpoint: {
    /** Production endpoint */
    Production: 'https://api.trakt.tv',
    /** Staging endpoint */
    Staging: 'https://api-staging.trakt.tv',
  },
  Website: {
    Production: 'https://trakt.tv',
    Staging: 'https://staging.trakt.tv',
  },
  Verification: {
    Url: 'https://trakt.tv/activate',
    code: (code: string) => `https://trakt.tv/activate/${code}`,
  },
};
