// orval.config.cjs
const { defineConfig } = require('orval');

module.exports = defineConfig({
  telegro: {
    input: {
      target: 'https://api.telegro.kr/v3/api-docs',
      override: {
        transformer: (openapi) => {
          if (openapi?.components?.securitySchemes?.['bearer-key']) {
            openapi.components.securitySchemes['bearer-key'] = {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
            };
          }
          return openapi;
        },
      },
    },
    output: {
      target: 'src/shared/apis/telegro/$client.ts',
      schemas: 'src/shared/apis/telegro/$schemas',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      override: {
        mutator: {
          path: 'src/shared/apis/telegro/axios-instance.ts',
          name: 'axiosInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          version: 5,
          queryOptions: {
            path: 'src/shared/apis/telegro/query-options.ts',
            name: 'customQueryOptions',
          },
          mutationOptions: {
            path: 'src/shared/apis/telegro/mutation-options.ts',
            name: 'customMutationOptions',
          },
        },
      },
    },
  },
});
