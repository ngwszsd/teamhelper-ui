// @ts-ignore
import { addons } from '@storybook/manager-api';
// @ts-ignore
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Teamhelper UI',
    brandUrl: '/',
    brandImage: '/logo@2x.webp',
    brandTarget: '_self',
  }),
});
