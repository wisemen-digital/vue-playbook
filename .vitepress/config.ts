import { defineConfig } from 'vitepress'
import { SearchPlugin } from "vitepress-plugin-search";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "The Frontend Bible",
  vite: {
    plugins: [
      SearchPlugin({
        preset: "default",
        context: "src",
        optimize: true,
      }),
    ]
  },
  srcDir: 'src',
  dir: 'src',
  cleanUrls: true,
  lastUpdated: true,
  description: "The Frontend Bible is a collection of best practices, design patterns, and libraries for building Vue.js applications.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Team', link: '/team' },
    ],
    editLink: {
      pattern: 'https://github.com/appwise-labs/frontend-bible/blob/main/src/:path'
    },
    logo: '/bible_logo.png',
    sidebar: [
      { text: 'Tools', link: '/tools'},
      { text: 'Project structure', link: '/project-structure'},
      { text: 'Clean code', link: '/clean-code'},
      { text: 'Naming conventions', link: '/naming-conventions'},
      { text: 'ESLint config', link: '/eslint-config'},
      { text: 'Teamwork', link: '/teamwork'},
      { text: 'Libraries', link: '/libraries'},
      { text: 'Components', link: '/components', items: [
          { text: 'Naming', link: '/components/naming' },
          { text: 'Structure', link: '/components/structure' },
          { text: 'Smart vs Dumb', link: '/components/smart-dumb' },
          { text: 'Props', link: '/components/props' },
          { text: 'Emits', link: '/components/emits' },
          { text: 'Slots', link: '/components/slots' },
          { text: 'Accessibility', link: '/components/accessibility' },
        ]
      },
      { text: 'Reusable code', link: '/reusable-code', items: [
          { text: 'Composables', link: '/reusable-code/composables' },
          { text: 'Utils', link: '/reusable-code/utils' },
          { text: 'Stores', link: '/reusable-code/stores' },
          { text: 'Services', link: '/reusable-code/services' },
          { text: 'Router', link: '/reusable-code/router' },
          { text: 'Authentication', link: '/reusable-code/authentication' },
      ]},
      { text: 'Testing', link: '/testing', items: [
        { text: 'Unit testing', link: '/testing/unit-testing' },
        { text: 'E2E testing', link: '/testing/e2e-testing' },
        { text: 'Integration testing', link: '/testing/integration-testing' },
        ]
      },
      {
        text: 'Design patterns', link: '/design-patterns', items: [
          {text: 'Solid', link: '/design-patterns/solid' },
          {text: 'Builder pattern', link: '/design-patterns/builder-pattern' },
        ],
      },
      {
        text: 'Packages', link: '/packages', items: [
          {text: 'oAuth client', link: '/packages/o-auth-client' },
        ],
      },
      {
        text: 'Meetings', link: '/meetings', items: [
          {text: 'Meeting 17/04/2023', link: '/meetings/meeting_17_04_2023' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/appwise-labs/frontend-bible' }
    ]
  }
})
