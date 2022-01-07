module.exports = {
  async headers() {
    return [
      {
        // Force disable caching for any NextAuth api routes. We need to do this because by default
        // these API endpoints do not return a Cache-Control header. If the header is missing, FrontDoor
        // CDN **will** cache the pages, which is a security risk and can return the wrong user:
        // https://docs.microsoft.com/en-us/azure/frontdoor/front-door-caching#cache-expiration
        source: '/api/auth/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};
