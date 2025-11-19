import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  // 设置初始全局变量
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
