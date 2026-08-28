import type { ComponentType } from 'react';

import { App } from '../App';
import { ThemeProvider } from '../components/theme-provider';

const meta = {
  title: 'S0-V/App Shell',
  component: App,
  decorators: [
    (Story: ComponentType) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const RuntimeHealth = {};
