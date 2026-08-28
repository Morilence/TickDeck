import type { UserConfig } from 'vite';

const config = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  // This shell has no generated controls/docs contract. Avoid loading react-docgen for every
  // module; Rolldown otherwise correctly reports the plugin as consuming most build time.
  typescript: { reactDocgen: false },
  viteFinal(viteConfig: UserConfig): UserConfig {
    return {
      ...viteConfig,
      build: {
        ...viteConfig.build,
        // Storybook's own iframe and axe runtimes are budgeted independently by
        // storybook-bundle-check; all unclassified chunks retain the 500 kB ceiling.
        chunkSizeWarningLimit: 1_200,
        rolldownOptions: {
          ...viteConfig.build?.rolldownOptions,
          checks: {
            ...viteConfig.build?.rolldownOptions?.checks,
            // Rolldown's relative-share heuristic reports a normal one-second CSS transform
            // in this short static build. The component script instead enforces an absolute
            // wall-time budget, while storybook-bundle-check owns per-artifact size budgets.
            pluginTimings: false,
          },
        },
      },
    };
  },
};

export default config;
